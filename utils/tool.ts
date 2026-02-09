import WalletManager from "./WalletManager";
import { SAVELOCALKEY } from "./enum";

const {KEY, ADDRESS, WALLETNAME, LASTLOGIN, } = SAVELOCALKEY

export const getWalletsFromLocal = () => {
    if (typeof window !== 'undefined') {
        const encryptKey = localStorage.getItem(KEY) || "[]"
        // let addressList: any = []
        try {
            const encryptKeyList = JSON.parse(encryptKey) as Array<any>
            // if (encryptKey.length) {
            //     addressList = encryptKeyList.map((item: any) => ({wallet: item.wallet, address: item.address}))
            // }
            return encryptKeyList
        } catch(e) {
            console.log("getWalletsFromLocal=>", e)
        }
    }
}
// export const setAddressInLocal = (address: string) => {
//     localStorage.setItem(ADDRESS, address)
// }

// 添加加密私钥文件
// 格式： [{address: "0x....", encryptoKey: jsonstring...}]
interface Item  {
    [ADDRESS]: string, [KEY]: string, [WALLETNAME]: string, [LASTLOGIN]: number | string
}
export const saveEncryptoKeyInLocal = (address: string, encryptoKey?: string) => {
    let savedKeyList = localStorage.getItem(KEY) || "[]"
    try {
        let obj = {}
        let parseList = (JSON.parse(savedKeyList)) as Array<Item>
        if (!parseList.length) {
            obj = {
                [ADDRESS]: address, 
                [KEY]: encryptoKey,
                [WALLETNAME]: WALLETNAME+1,
                [LASTLOGIN]: Date.now()
            }
            localStorage.setItem(KEY, JSON.stringify([obj]))
            // return JSON.stringify([{
            //     [ADDRESS]: address, 
            //     [KEY]: encryptoKey
            // }])
        } else {
            if (!encryptoKey) {
                // 只更新最新登录时间
                parseList.forEach(item => {
                    if (item[ADDRESS] === address) {
                        item[LASTLOGIN] = Date.now()
                        obj = item
                    }
                })
            } else {
                let repeatIdx = -1
                const repeatItem = parseList.filter((item, idx) => {
                    const flag = item[ADDRESS] === address
                    if (flag) repeatIdx = idx;
                    return flag
                })[0]
                if (repeatItem) {
                    obj = {...repeatItem, [KEY]: encryptoKey, [LASTLOGIN]: Date.now()} as Item
                    parseList[repeatIdx] = obj
                } else {
                    obj = {
                        [ADDRESS]: address, 
                        [KEY]: encryptoKey,
                        [WALLETNAME]: WALLETNAME+(parseList.length+1),
                        [LASTLOGIN]: Date.now()
                    }
                    parseList.push(obj)
                }
                
            }
            localStorage.setItem(KEY, JSON.stringify(parseList))
            return obj
        }
    } catch(e) {
        console.log("parse savedKeyList failed!")
    }
}

export const downloadJSONFile = (
    jsonString: string, 
    fileName: string
    ) => {
    const blob = new Blob([jsonString], {
        type: "application/json",
    })
    const objectURL = URL.createObjectURL(blob)
    const aTag = document.createElement("a")
    aTag.href = objectURL
    aTag.download = fileName
    aTag.click()
    URL.revokeObjectURL(objectURL)
}

export const getUploadFileText = (file: Blob) => {
    // const file = event.target.files[0]; // 获取选择的文件
    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();

            // 设置读取完成后的回调函数
            reader.onload = e => {
                const content = e.target?.result; // 读取到的文件内容，以文本形式
                console.log(content); // 输出或处理内容
                resolve(content || "")
            };
            reader.onerror = e => {
                resolve("")
            }
            // 以文本形式读取文件
            reader.readAsText(file);
            
            // 或者，需要以DataURL的形式读取（常用于图片等）
            // reader.readAsDataURL(file);
        } else {
            resolve("")
        }
    })
}

interface ITextEllipsisOptions {
    preDigits?: number
    endDigits?: number
}

export const textEllipsis = (text: string, option?: ITextEllipsisOptions) => {
    const { preDigits = 2, endDigits = 4 } = option || {}
    if (!text) return
    if (text.length <= preDigits + endDigits) return text
    return text.substring(0, preDigits) + '...' + text.substring(text.length - endDigits)
}
  