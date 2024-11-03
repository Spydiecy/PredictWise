import React, { useState, useEffect } from 'react';
import './PastRounds.css';
import { ethers } from 'ethers';
import { getContract, getSignedContract, connectWallet } from '../utils/contractUtils';
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

    if (isLoading) return <div>Loading past rounds...</div>;

    if (!account) return <div>Please connect your wallet to view past rounds.</div>;

    return (
        <div className="past-rounds-container">
            <h3>Past Rounds</h3>
            {pastRounds.length > 0 ? (
                <table className="past-rounds-table">
                    <thead>
                        <tr>
                            <th>Round</th>
                            <th>Close Price</th>
                            <th>Your Bet</th>
                            <th>Result</th>
                            <th>Claim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastRounds.map(round => (
                            <tr key={round.epoch} className="past-round-row">
                                <td>Round {round.epoch}</td>
                                <td>{ethers.formatUnits(round.closePrice, 8)}</td>
                                <td>{round.userAmount} XTZ {round.userBull ? 'UP' : 'DOWN'}</td>
                                <td>{round.cancelled ? 'Cancelled' : (round.bullWon ? 'UP' : 'DOWN')}</td>
                                <td>
                                    {!round.claimed && Number(round.userAmount) > 0 ? (
                                        <button 
                                            onClick={() => handleClaim(round.epoch)}
                                            disabled={isClaimLoading || round.cancelled}
                                            className="claim-button"
                                        >
                                            {isClaimLoading ? 'Claiming...' : 'Claim Reward'}
                                        </button>
                                    ) : round.claimed ? (
                                        <p>Rewards Claimed</p>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No past rounds found.</p>
            )}
        </div>
    );
    
    
};

export default PastRounds;