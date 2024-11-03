import { useState, useEffect } from 'react';
import { getTezosPrice } from '../utils/api';

const useTokenPrice = (intervalTime = 30000) => {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const price = await getTezosPrice();
                setPrice(price);
            } catch (error) {
                console.error("Error fetching token price:", error);
            }
        };

        fetchPrice(); // Initial fetch
        const intervalId = setInterval(fetchPrice, intervalTime); // Fetch every `intervalTime` ms

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [intervalTime]);

    return price;
};

export default useTokenPrice;
