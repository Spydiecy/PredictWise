import React, { useState } from 'react';
import { ethers } from 'ethers';
import { formatPrice, formatAmount, getMultipliers } from '../utils/helpers';
import { getSignedContract } from '../utils/contractUtils';
import { ArrowUp, ArrowDown, Timer } from 'lucide-react';

const PredictionCard = ({ currentPrice, roundInfo }) => {
    const [amount, setAmount] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');

    if (!roundInfo) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
        </div>
    );

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
        <div className="relative group w-full max-w-md mx-auto">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative p-6 bg-gradient-to-r from-violet-950/90 to-indigo-950/90 rounded-lg border border-violet-500/10 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">
                    {isLocked ? `Live Round (${Number(roundInfo.epoch)})` : `Bet for Round (${Number(roundInfo.epoch)})`}
                </h2>

                {isLocked ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {/* Up Multiplier */}
                            <div className="bg-green-500/20 rounded-lg p-4 text-center">
                                <h4 className="text-green-300 text-sm font-medium mb-1">Up</h4>
                                <p className="text-lg font-bold text-green-200">{bullMultiplier}x</p>
                            </div>

                            {/* Current Price */}
                            <div className="bg-violet-500/10 rounded-lg p-4 text-center">
                                <h4 className="text-violet-300 text-sm font-medium mb-1">Current</h4>
                                <p className="text-lg font-bold text-violet-200">${currentPrice}</p>
                            </div>

                            {/* Down Multiplier */}
                            <div className="bg-red-500/20 rounded-lg p-4 text-center">
                                <h4 className="text-red-300 text-sm font-medium mb-1">Down</h4>
                                <p className="text-lg font-bold text-red-200">{bearMultiplier}x</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-violet-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-violet-300">Locked Price</span>
                                    <span className="text-violet-200 font-medium">${lockPrice}</span>
                                </div>
                            </div>

                            <div className="bg-violet-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-violet-300">Price Change</span>
                                    <span className={`font-medium ${(lockPrice - currentPrice) > 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {(lockPrice - currentPrice).toFixed(7)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-violet-500/10 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-violet-300">Prize Pool</span>
                                    <span className="text-violet-200 font-medium">{totalAmount} XTZ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handlePrediction('up')}
                                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2
                                    ${selectedDirection === 'up'
                                        ? 'bg-green-500/30 border border-green-500/50'
                                        : 'bg-violet-500/10 hover:bg-green-500/20'}`}
                            >
                                <ArrowUp className="w-6 h-6 text-green-400" />
                                <span className="text-green-300 font-medium">Up</span>
                            </button>

                            <button
                                onClick={() => handlePrediction('down')}
                                className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2
                                    ${selectedDirection === 'down'
                                        ? 'bg-red-500/30 border border-red-500/50'
                                        : 'bg-violet-500/10 hover:bg-red-500/20'}`}
                            >
                                <ArrowDown className="w-6 h-6 text-red-400" />
                                <span className="text-red-300 font-medium">Down</span>
                            </button>
                        </div>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter XTZ amount"
                            className="w-full p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-200 placeholder-violet-400/50 focus:outline-none focus:border-violet-500/50"
                        />

                        <button
                            onClick={handleCommit}
                            disabled={!selectedDirection || !amount}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                                ${(!selectedDirection || !amount)
                                    ? 'bg-violet-500/20 text-violet-300/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-400 hover:to-indigo-400'
                                }`}
                        >
                            Commit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionCard;