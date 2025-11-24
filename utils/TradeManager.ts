import { ethers } from "ethers"

export default class TradeManager {
    private wallet;
    private static instance;

    private constructor(props: any) {
        this.wallet = props?.wallet
    }

    public static getInstance(): TradeManager {
        if (!TradeManager.instance) {
            TradeManager.instance = new TradeManager()
        }
        return TradeManager.instance;
    }



}