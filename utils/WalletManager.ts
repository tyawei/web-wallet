import { ethers } from 'ethers'
import { SAVELOCALKEY } from './enum'
import { setAddressInLocal } from './tool';

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

    createWalletAndMnemonic() {
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
        localStorage.setItem(ADDRESS,  address)
        return this.walletInfo
    }

    async encryptPKeyAndSaveLocal(password: string) {
        if (!this.wallet) return null;

        const encryptKeyPromise = this.wallet.encrypt(password)
        if (typeof window !== undefined) {
            const keyJSON = await encryptKeyPromise

            console.log("encryptKey==", keyJSON, "; rawKey==", this.wallet.privateKey)

            localStorage.setItem(KEY, keyJSON)
            return keyJSON
        }
    }

    async decryptPrivateKey(keyJSON: string, password: string, recoverWalletFromBackUp: boolean = false) {
        keyJSON = keyJSON || (localStorage.getItem(KEY) || "")
        try  {
            const wallet = await ethers.Wallet.fromEncryptedJson(keyJSON, password)
            this.setWalletInfo({
                address: wallet.address,
                mnemonic: wallet.mnemonic?.phrase,
                // ...wallet,
            })

            // 如果是结合备份的加密私钥文件找回钱包，需要重新保存在本地
            recoverWalletFromBackUp && localStorage.setItem(KEY, keyJSON);

            localStorage.setItem(ADDRESS, wallet.address)
            return wallet
        } catch(e) {
            console.log(e)
            return null
        }
    }

    recoverWalletFromMnemonic(phrase: string, path = "m/44'/60'/0'/0/0") {
        try {
            const wallet = ethers.Wallet.fromPhrase(phrase);
            if (wallet) {
                this.wallet = wallet 

                const {address, mnemonic, privateKey,} = wallet

                this.setWalletInfo({address, mnemonic: mnemonic?.phrase, privateKey,})
                setAddressInLocal(address)

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