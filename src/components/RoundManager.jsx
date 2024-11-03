import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTezosPrice } from '../utils/api';
import useContract from '../hooks/useContract';
import { Timer, DollarSign, Lock, Unlock } from 'lucide-react';

const ROUND_DURATION = 7 * 60; // 7 minutes
const LOCK_DURATION = 2 * 60; // 2 minutes

const RoundManager = ({ currentPrice, roundInfo }) => {
    const [timeLeft, setTimeLeft] = useState();
    const contract = useContract();

    useEffect(() => {
        if (!contract || !roundInfo) return;

        const updateRound = async () => {
            const now = Math.floor(Date.now() / 1000);
            const start = Number(roundInfo.startTimestamp);
            const end = start + ROUND_DURATION;
            const lockTime = start + LOCK_DURATION;
            const timeRemaining = end - now;

            setTimeLeft(Math.max(timeRemaining, 0));

            if (now >= lockTime && !roundInfo.lockPrice) {
                await handleLockRound();
            }

            if (now >= end && !roundInfo.closePrice) {
                await handleEndRound();
            }

            if (now >= end && roundInfo.closePrice) {
                await handleStartRound();
            }
        };

        const interval = setInterval(updateRound, 1000);
        return () => clearInterval(interval);
    }, [contract, roundInfo, setTimeLeft]);

    const handleStartRound = async () => {
        try {
            const tx = await contract.startRound();
            await tx.wait();
            console.log("New round started successfully!");
        } catch (err) {
            console.error("Error starting new round:", err);
        }
    };

    const handleLockRound = async () => {
        try {
            const price = await getTezosPrice();
            const tx = await contract.lockRound(ethers.parseUnits(price.toString(), 8));
            await tx.wait();
            console.log("Round locked successfully with price:", price);
        } catch (err) {
            console.error("Error locking round:", err);
        }
    };

    const handleEndRound = async () => {
        try {
            const price = await getTezosPrice();
            const tx = await contract.endRound(ethers.parseUnits(price.toString(), 8));
            await tx.wait();
            console.log("Round ended successfully with price:", price);
        } catch (err) {
            console.error("Error ending round:", err);
        }
    };

    if (!roundInfo) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
        </div>
    );

    const now = Math.floor(Date.now() / 1000);
    const isLocked = roundInfo.lockTimestamp <= now;
    const start = Number(roundInfo.startTimestamp);
    const lockTime = start + LOCK_DURATION;
    const end = start + ROUND_DURATION;
    const remainingTime = isLocked ? (end - now > 0 ? end - now : 0) : lockTime - now;
    const timeLabel = isLocked ? 'Time Left' : 'Betting Time Left';

    // Calculate progress percentage for the progress bar
    const totalDuration = isLocked ? ROUND_DURATION - LOCK_DURATION : LOCK_DURATION;
    const elapsedTime = isLocked ? end - now : lockTime - now;
    const progress = ((totalDuration - elapsedTime) / totalDuration) * 100;

    return (
        <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative p-6 bg-gradient-to-r from-violet-950/90 to-indigo-950/90 rounded-lg border border-violet-500/10 backdrop-blur-sm">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isLocked 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                        {isLocked ? (
                            <><Lock className="w-3 h-3 mr-1" /> Locked</>
                        ) : (
                            <><Unlock className="w-3 h-3 mr-1" /> Open</>
                        )}
                    </span>
                </div>

                {/* Price Display */}
                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-violet-400" />
                        <span className="text-sm font-medium text-violet-300">Current Price</span>
                    </div>
                    <div className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">
                        {currentPrice ? `$${currentPrice.toFixed(5)}` : 'Loading...'}
                    </div>
                </div>

                {/* Timer Display */}
                <div className="relative">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <Timer className="w-5 h-5 text-violet-400" />
                        <span className="text-sm font-medium text-violet-300">{timeLabel}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-violet-950/50 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                                isLocked 
                                    ? 'bg-gradient-to-r from-red-500 to-red-400' 
                                    : 'bg-gradient-to-r from-green-500 to-green-400'
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Time Display */}
                    {remainingTime > 0 ? (
                        <div className="mt-2 text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-indigo-200">
                            {Math.floor(remainingTime / 60)}:
                            {(remainingTime % 60).toString().padStart(2, '0')}
                        </div>
                    ) : (
                        <div className="mt-2 text-center text-violet-300">
                            Calculating next round...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoundManager;