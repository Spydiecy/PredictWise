// src/utils/walletUtils.js
import { ethers } from 'ethers';

let connecting = false;

export const connectWallet = async () => {
    if (connecting) {
        console.log("Wallet connection already in progress");
        return;
    }
    
    connecting = true;
    try {
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            connecting = false;
            return { signer, address };
        } else {
            alert("Please install MetaMask!");
            connecting = false;
            return null;
        }
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        connecting = false;
        return null;
    }
};