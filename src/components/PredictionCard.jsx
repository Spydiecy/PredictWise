import React, { useState } from 'react';
import { ethers } from 'ethers';
import { formatPrice, formatAmount, getMultipliers } from '../utils/helpers';
import './PredictionCard.css';
import {  getSignedContract } from '../utils/contractUtils';

const PredictionCard = ({currentPrice, roundInfo}) => {
    const [amount, setAmount] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');

    if (!roundInfo) return <div>Loading...</div>;

    const lockPrice = formatPrice(roundInfo.lockPrice);
    const totalAmount = formatAmount(roundInfo.totalAmount);
    const { bullMultiplier, bearMultiplier } = getMultipliers(roundInfo.totalAmount, roundInfo.bullAmount, roundInfo.bearAmount);
    const isLocked = roundInfo.lockTimestamp <= Math.floor(Date.now() / 1000);

    const handlePrediction = (direction) => {
        setSelectedDirection(direction);
    };

    const handleCommit = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            const signedContract = await getSignedContract();
            const tx = await signedContract.placeBet(selectedDirection === 'up', {
                value: ethers.parseEther(amount),
            });
            await tx.wait();
            alert("Bet placed successfully!");
            setAmount('');
            setSelectedDirection('');
        } catch (error) {
            console.error("Error placing bet:", error);
            alert("Failed to place bet. Please try again.");
        }
    };

    return (
        <div className="card prediction-card">
            {isLocked ? (
                <>
                    <h2>Live Round ({Number(roundInfo.epoch)})</h2>
                    <div className="container">
                        <div className="info-box up">
                            <h4>Up</h4>
                            <p>{bullMultiplier}x</p>
                        </div>
                        <div className="info-container">
                            <div className="price-info">
                                <div>
                                    <h4>Current Price</h4>
                                    <p>${currentPrice}</p>
                                </div>
                                <div>
                                    <h4>Price Change</h4>
                                    <p>{(lockPrice - currentPrice).toFixed(7)}</p>
                                </div>
                            </div>
                            <div className="locked-price">
                                <h4>Locked Price</h4>
                                <p>${lockPrice}</p>
                            </div>
                            <div className="prize-pool">
                                <h4>Prize Pool</h4>
                                <p>{totalAmount} XTZ</p>
                            </div>
                        </div>
                        <div className="info-box down">
                            <h4>Down</h4>
                            <p>{bearMultiplier}x</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h2>Bet for Round ({Number(roundInfo.epoch)})</h2>
                    <div className="prediction-buttons">
                        <button
                            onClick={() => handlePrediction('up')}
                            className={`up-button ${selectedDirection === 'up' ? 'selected' : ''}`}
                        >
                            📈 Up
                        </button>
                        <button
                            onClick={() => handlePrediction('down')}
                            className={`down-button ${selectedDirection === 'down' ? 'selected' : ''}`}
                        >
                            📉 Down
                        </button>
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter XTZ amount"
                        className="amount-input"
                    />
                    <div className="action-buttons">
                        <button onClick={handleCommit} className="commit-button">
                            Commit
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PredictionCard;
