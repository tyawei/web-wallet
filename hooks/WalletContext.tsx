import React, { createContext, useContext, useRef } from 'react';
import WalletManager from '../utils/WalletManager';

const WalletContext = createContext<WalletManager | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const walletManagerRef = useRef(new WalletManager()); // 当WalletManager不使用单例模式使用这里
    
    return (
        <WalletContext.Provider value={walletManagerRef.current}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};


/*
    根组件中：

import { WalletProvider } from './WalletContext';
function App() {
    return (
        <WalletProvider>
            <Router>
                ...
            </Router>
        </WalletProvider>
    );
}

    使用walletManager的组件中：

import { useWallet } from './WalletContext';
function ComponentA() {
    const walletManager = useWallet();
    
    const handleRecover = () => {
        walletManager.recoverWalletFromMnemonic(phrase);
    };
}

*/