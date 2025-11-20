import { ethers } from 'ethers'
import { SAVELOCALKEY } from './enum'
import { saveEncryptoKeyInLocal } from './tool';

interface WalletInfo {
    address: string;
    mnemonic: string | undefined;
    // privateKey?: string;
    [key: string]: any
}
const { KEY, ADDRESS, } = SAVELOCALKEY

export default class WalletManager {
    private static instance: WalletManager;
    private wallet: any;
    private walletInfo: any;

    private constructor() {}

    // 之前发现在login 和 registry 组件无法获取到已经设置过的wallet walletInfo 对象
    // 想半天才想起来必须单例
    // 也可以使用另一个方案：useContext + provider
    public static getInstance(): WalletManager {
        if (!WalletManager.instance) {
            WalletManager.instance = new WalletManager();
        }
        return WalletManager.instance;
    }

    getWalletInfo() {
        if (!this.wallet) return null
        return this.walletInfo || {}
    }

    setWalletInfo(info: WalletInfo) {
        this.walletInfo = { ...info }
    }

    createWalletAndMnemonic(password: string) {
        // wallet.address
        // wallet.privateKey
        // wallet.mnemonic
        const phrase = ethers.Wallet.createRandom().mnemonic?.phrase
        this.wallet = phrase ? ethers.Wallet.fromPhrase(phrase) : null

        if (!this.wallet) return null;
        const { address, privateKey, mnemonic } = this.wallet

        this.setWalletInfo({
            address, 
            privateKey,
            mnemonic: mnemonic?.phrase,
        })
        // localStorage.setItem(ADDRESS,  address)
        this.encryptPKeyAndSaveLocal(password)
        return this.walletInfo
    }

    async encryptPKeyAndSaveLocal(password: string) {
        if (!this.wallet) return null;

        const encryptKeyPromise = this.wallet.encrypt(password)
        if (typeof window !== undefined) {
            const keyJSON = await encryptKeyPromise

            console.log("encryptKey==", keyJSON, "; rawKey==", this.wallet.privateKey)

            // localStorage.setItem(KEY, keyJSON)
            saveEncryptoKeyInLocal(this.wallet.address, keyJSON)
            return keyJSON
        }
    }

    // wallet.encrypt(password) 每次使用相同的password加密后，encryptedJson会改变
    // 但是，即使会改变，使用原来的密码同样能够正确解密。所以每次使用密码来登录解密出钱包，不必更新已保存的加密私钥数据
    async decryptPrivateKey(encryptoKey: string, password: string, recoverWalletFromBackUp: boolean = false) {
        encryptoKey = encryptoKey || (localStorage.getItem(KEY) || "[]")
        let wallet

        const encryptKeyList = JSON.parse(encryptoKey)

        for (let i = 0; i < encryptKeyList.length; i++) {
            try {
                wallet = await ethers.Wallet.fromEncryptedJson(encryptKeyList[i][KEY], password)
                if (wallet) break;
            }catch(e) {
                console.log("ee===", e)
                // 这里需要继续，否则捕获到错误后，wallet就会返回空，提示解密不成功
                continue;
            }
        }

        // const encryptKeyPromises = encryptKeyList.map((itm: string) => ethers.Wallet.fromEncryptedJson(itm[KEY], password))
        // 使用race当有多个钱包promise，一旦有password不正确的某个钱包key，就会抛出错误，导致另一个本来可以被password解密的钱包没有解出来
        // 因此，采用for循环 || null，在捕获到错误后继续循环，直到有wallet值为止
        // const wallet = (await Promise.race(encryptKeyPromises)) as ethers.Wallet | ethers.HDNodeWallet

        if (!wallet) return null

        // const wallet = await ethers.Wallet.fromEncryptedJson(encryptoKey, password)
        this.setWalletInfo({
            address: wallet.address,
            mnemonic: wallet.mnemonic?.phrase,
            // ...wallet,
        })

        // 如果是结合备份的加密私钥文件找回钱包，需要重新保存在本地
        recoverWalletFromBackUp && localStorage.setItem(KEY, encryptoKey);

        return wallet
    }

    recoverWalletFromMnemonic(phrase: string, path = "m/44'/60'/0'/0/0") {
        try {
            const wallet = ethers.Wallet.fromPhrase(phrase);
            if (wallet) {
                this.wallet = wallet 

                const {address, mnemonic, privateKey,} = wallet

                this.setWalletInfo({address, mnemonic: mnemonic?.phrase, privateKey,})

                // 从助记词恢复，就没有加密私钥文件
                saveEncryptoKeyInLocal(address, "")

                return this.walletInfo;
            }
            return null

            // 如果本地没有keyJSON，需要获取密码将密钥加密并执行encryptPKeyAndSaveLocal，以及保存address在本地
            // 但是忘记密码问题也不大，在恢复钱包的时候，可以让用户选择是否重置密码

            // 但是重置密码后，不能创建新钱包，因为有助记词已经恢复了
            // 只需要用新密码将恢复后的钱包加密privateKey成JSON，并保存本地替换旧的就行

        } catch(e) {    
            console.log("e---", e)
            return null
        }

    }

    isValidAddress(address: string) {
        return ethers.isAddress(address)
    }
}