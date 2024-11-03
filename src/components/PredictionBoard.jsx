import React, { useEffect, useState } from 'react';
import PastRounds from './PastRounds';
import RoundManager from './RoundManager';
import './PredictionBoard.css';
import PredictionCard from './PredictionCard';
import useTokenPrice from '../hooks/useTokenPrice';
import useRoundData from '../hooks/useRoundData';

const PredictionBoard = () => {
    const tokenPrice = useTokenPrice(); // Fetch the token price here
    const [currentPrice, setCurrentPrice] = useState(null);
    const { roundInfo } = useRoundData();

    useEffect(() => {
        if (tokenPrice) {
            setCurrentPrice(tokenPrice);
        }
    }, [tokenPrice]);
    return (
        <div className="prediction-board">
            <h1>Market Prediction Board</h1>
            <RoundManager currentPrice={currentPrice} roundInfo={roundInfo}/>
            <div className="card-container">
            <PredictionCard currentPrice={currentPrice} roundInfo={roundInfo}/>
            </div>
            <PastRounds />
        </div>
    );
};

export default PredictionBoard;