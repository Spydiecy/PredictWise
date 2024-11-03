import React, { useEffect, useState } from 'react';
import PastRounds from './PastRounds';
import RoundManager from './RoundManager';
import PredictionCard from './PredictionCard';
import useTokenPrice from '../hooks/useTokenPrice';
import useRoundData from '../hooks/useRoundData';

const PredictionBoard = () => {
    const tokenPrice = useTokenPrice();
    const [currentPrice, setCurrentPrice] = useState(null);
    const { roundInfo } = useRoundData();

    useEffect(() => {
        if (tokenPrice) {
            setCurrentPrice(tokenPrice);
        }
    }, [tokenPrice]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                Market Prediction Board
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <RoundManager currentPrice={currentPrice} roundInfo={roundInfo} />
                    <PredictionCard currentPrice={currentPrice} roundInfo={roundInfo} />
                </div>
                
                <div>
                    <PastRounds />
                </div>
            </div>
        </div>
    );
};

export default PredictionBoard;