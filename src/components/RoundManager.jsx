import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTezosPrice } from '../utils/api';
import useContract from '../hooks/useContract';

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

    if (!roundInfo) return <div>Loading...</div>;

    // Determine if the round is locked
    const now = Math.floor(Date.now() / 1000);
    const isLocked = roundInfo.lockTimestamp <= now;

    const start = Number(roundInfo.startTimestamp);
    const lockTime = start + LOCK_DURATION;
    const end = start + ROUND_DURATION;

    // Calculate remaining time for Next Round (if betting is open) or Live Round
    const remainingTime = isLocked ? (end - now > 0 ? end - now : 0) : lockTime - now;
    const timeLabel = isLocked ? 'Time Left' : 'Betting Time Left';

    return (
        <div className="round-manager">
            <div>Current Price: {currentPrice ? `$${currentPrice.toFixed(5)}` : 'Loading...'}</div>
            {remainingTime > 0 ? (<div>{timeLabel}: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</div>) : (<div>Calculating Wait for Next Round...</div>)}

        </div>
    );
};

export default RoundManager;
