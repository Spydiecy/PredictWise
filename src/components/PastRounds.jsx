import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getSignedContract } from '../utils/contractUtils';
import { useActiveAccount } from 'thirdweb/react';

const PastRounds = () => {
    const [pastRounds, setPastRounds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClaimLoading, setIsClaimLoading] = useState(false);
    const account = useActiveAccount();
    

    useEffect(() => {
        const fetchPastRounds = async () => {
            if (!account) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const contract = getContract();
                const currentEpoch = await contract.currentEpoch();
                const rounds = [];

                for (let i = 1; i <= 5; i++) {
                    const epoch = Number(currentEpoch) - i;
                    if (epoch < 0) break;

                    const round = await contract.rounds(epoch);
                    const userRound = await contract.ledger(epoch, account.address);

                    rounds.push({
                        epoch,
                        closePrice: round.closePrice,
                        bullWon: round.bullWon,
                        bearWon: round.bearWon,
                        cancelled: round.cancelled,
                        userAmount: ethers.formatEther(userRound.amount),
                        userBull: userRound.bull,
                        claimed: userRound.claimed,
                    });
                }

                setPastRounds(rounds);
            } catch (error) {
                console.error("Error fetching past rounds:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastRounds();
        const intervalId = setInterval(fetchPastRounds, 5 * 60000);

        return () => clearInterval(intervalId);
    }, [account]);

    const handleClaim = async (epoch) => {

        setIsClaimLoading(true);
        try {
            const signedContract = await getSignedContract();
            const tx = await signedContract.claim(epoch);
            await tx.wait();
            alert(`Successfully claimed rewards for round ${epoch}`);
            setPastRounds(prev => prev.map(round => 
                round.epoch === epoch ? {...round, claimed: true} : round
            ));
        } catch (error) {
            console.error("Error claiming rewards:", error);
            alert("Failed to claim rewards. Please try again.");
        }
        setIsClaimLoading(false);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
        </div>
    );

    if (!account) return (
        <div className="text-center p-8 text-violet-300/80">
            Please connect your wallet to view past rounds.
        </div>
    );

    return (
        <div className="w-full p-6">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300 mb-6">
                Past Rounds
            </h3>
            
            {pastRounds.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-violet-500/10 backdrop-blur-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gradient-to-r from-violet-950/90 to-indigo-950/90">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-violet-300 font-medium">Round</th>
                                <th scope="col" className="px-6 py-4 text-violet-300 font-medium">Close Price</th>
                                <th scope="col" className="px-6 py-4 text-violet-300 font-medium">Your Bet</th>
                                <th scope="col" className="px-6 py-4 text-violet-300 font-medium">Result</th>
                                <th scope="col" className="px-6 py-4 text-violet-300 font-medium">Claim</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastRounds.map(round => (
                                <tr key={round.epoch} 
                                    className="border-b border-violet-500/10 bg-violet-950/30 backdrop-blur-sm hover:bg-violet-900/40 transition duration-200">
                                    <td className="px-6 py-4 text-violet-200">Round {round.epoch}</td>
                                    <td className="px-6 py-4 text-violet-200">{ethers.formatUnits(round.closePrice, 8)}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center space-x-2">
                                            <span className="text-violet-200">{round.userAmount} XTZ</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                round.userBull 
                                                    ? 'bg-green-500/20 text-green-300' 
                                                    : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {round.userBull ? 'UP' : 'DOWN'}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {round.cancelled ? (
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-300">
                                                Cancelled
                                            </span>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                round.bullWon 
                                                    ? 'bg-green-500/20 text-green-300' 
                                                    : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {round.bullWon ? 'UP' : 'DOWN'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {!round.claimed && Number(round.userAmount) > 0 ? (
                                            <button 
                                                onClick={() => handleClaim(round.epoch)}
                                                disabled={isClaimLoading || round.cancelled}
                                                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                                                    ${isClaimLoading || round.cancelled
                                                        ? 'bg-violet-900/40 text-violet-400/50 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-400 hover:to-indigo-400'
                                                    }`}
                                            >
                                                {isClaimLoading ? 'Claiming...' : 'Claim Reward'}
                                            </button>
                                        ) : round.claimed ? (
                                            <span className="text-violet-400/50">Rewards Claimed</span>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-8 text-violet-300/80">
                    No past rounds found.
                </div>
            )}
        </div>
    );
};

export default PastRounds;