// src/services/tokenPriceService.js
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd';
const BACKUP_API = 'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd'; // Replace with an actual backup API

export const fetchTokenPrice = async () => {
    try {
        const response = await axios.get(COINGECKO_API);
        return response.data.tezos.usd;
    } catch (error) {
        console.error("Error fetching from primary source:", error);
        try {
            const backupResponse = await axios.get(BACKUP_API);
            return backupResponse.data.price;
        } catch (backupError) {
            console.error("Error fetching from backup source:", backupError);
            throw new Error("Failed to fetch token price from all sources");
        }
    }
};