import { ethers } from 'ethers';

export const formatPrice = (price, decimals = 8) => ethers.formatUnits(price, decimals);
export const formatAmount = (amount) => ethers.formatEther(amount);

export const getTimeRemaining = (endTimestamp) => {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(Number(endTimestamp) - now, 0);
};

export const getMultipliers = (totalAmount, bullAmount, bearAmount) => {
    const bullMultiplier = bullAmount > 0 ? (Number(totalAmount) / Number(bullAmount)).toFixed(2) : '0';
    const bearMultiplier = bearAmount > 0 ? (Number(totalAmount) / Number(bearAmount)).toFixed(2) : '0';
    return { bullMultiplier, bearMultiplier };
};
