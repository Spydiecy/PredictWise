// hooks/useRoundData.js
import { useState, useEffect, useCallback } from 'react';
import { getContract } from '../utils/contractUtils';


const useRoundData = () => {
    const [roundInfo, setRoundInfo] = useState(null);
    const [currentEpoch, setCurrentEpoch] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchRoundData = useCallback(async () => {
        try {
            const contract = getContract();
            const currentEpoch = await contract.currentEpoch();
            const round = await contract.rounds(currentEpoch);
            setRoundInfo(round);
            setCurrentEpoch(currentEpoch);
        } catch (error) {
            console.error('Error fetching round data:', error);
        }
    }, []);

    useEffect(() => {
        fetchRoundData();
        const intervalId = setInterval(fetchRoundData, 10000);
        return () => clearInterval(intervalId);
    }, [fetchRoundData]);

    return { roundInfo, currentEpoch, timeLeft, setTimeLeft };
};

export default useRoundData;
