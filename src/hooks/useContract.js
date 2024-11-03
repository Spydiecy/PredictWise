import { getContract } from '../utils/contractUtils';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
const useContract = () => {
    const [contract, setContract] = useState(null);
    useEffect(() => {
        const initializeContract = async () => {
            try {
                const privateKey = process.env.VITE_PRIVATE_KEY;
                if (!privateKey) {
                    throw new Error("Private key not found in environment variables");
                }
                const provider = new ethers.JsonRpcProvider('https://node.ghostnet.etherlink.com');
                const signer = new ethers.Wallet(privateKey, provider);
                const initializedContract = getContract().connect(signer);
                setContract(initializedContract);
            } catch (err) {
                console.error("Error initializing contract:", err);
                console.log("Failed to initialize contract. Check console for details.");
            }
        };
    
        initializeContract();
    }, []);

    return contract;
}

export default useContract;



