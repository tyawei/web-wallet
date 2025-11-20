import WalletManager from "./WalletManager";
import { SAVELOCALKEY } from "./enum";

const {ADDRESS,} = SAVELOCALKEY

export const getAddressFromLocal = () => {
    return localStorage.getItem(ADDRESS)
}
export const setAddressInLocal = (address: string) => {
    localStorage.setItem(ADDRESS, address)
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