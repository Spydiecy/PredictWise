// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PredictionGame is Ownable, ReentrancyGuard {
    struct Round {
        uint256 epoch;
        uint256 startTimestamp;
        uint256 lockTimestamp;
        uint256 closeTimestamp;
        int256 lockPrice;
        int256 closePrice;
        uint256 totalAmount;
        uint256 bullAmount;
        uint256 bearAmount;
        bool bullWon;
        bool bearWon;
        bool cancelled;
    }

    struct UserRound {
        uint256 amount;
        bool claimed;
        bool bull;
    }

    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => UserRound)) public ledger;

    uint256 public currentEpoch;
    uint256 public constant ROUND_LENGTH = 7 minutes;
    uint256 public constant BUFFER_TIME = 2 minutes;
    uint256 public minBetAmount;
    uint256 public treasuryFee;
    int256 public constant PRECISION = 1e8;

    address public adminAddress;

    event RoundStarted(uint256 indexed epoch, uint256 startTimestamp);
    event RoundLocked(uint256 indexed epoch, int256 lockPrice);
    event BetPlaced(address indexed sender, uint256 indexed epoch, uint256 amount, bool bull);
    event RoundEnded(uint256 indexed epoch, int256 closePrice, bool bullWon, bool bearWon);
    event Claim(address indexed sender, uint256 indexed epoch, uint256 amount);

    constructor(uint256 _minBetAmount, uint256 _treasuryFee, address _adminAddress) Ownable(msg.sender) {
        minBetAmount = _minBetAmount;
        treasuryFee = _treasuryFee;
        adminAddress = _adminAddress;
    }

    function startRound() external {
        require(currentEpoch == 0 || rounds[currentEpoch].closeTimestamp <= block.timestamp, "Current round not ended");
        currentEpoch++;
        Round storage round = rounds[currentEpoch];
        round.epoch = currentEpoch;
        round.startTimestamp = block.timestamp;
        round.lockTimestamp = block.timestamp + BUFFER_TIME;
        round.closeTimestamp = block.timestamp + ROUND_LENGTH;
        
        emit RoundStarted(currentEpoch, block.timestamp);
    }

    function placeBet(bool bull) external payable {
        require(msg.value >= minBetAmount, "Bet amount too small");
        require(block.timestamp < rounds[currentEpoch].lockTimestamp, "Betting is closed");

        Round storage round = rounds[currentEpoch];
        UserRound storage userRound = ledger[currentEpoch][msg.sender];

        if (bull) {
            round.bullAmount += msg.value;
        } else {
            round.bearAmount += msg.value;
        }
        round.totalAmount += msg.value;

        userRound.amount += msg.value;
        userRound.bull = bull;

        emit BetPlaced(msg.sender, currentEpoch, msg.value, bull);
    }

    function lockRound(int256 _lockPrice) external onlyOwner {
        require(block.timestamp >= rounds[currentEpoch].lockTimestamp, "Cannot lock round before lockTimestamp");
        require(rounds[currentEpoch].lockPrice == 0, "Round already locked");
        
        rounds[currentEpoch].lockPrice = _lockPrice;

        emit RoundLocked(currentEpoch, _lockPrice);
    }

    function endRound(int256 _closePrice) external onlyOwner {
        require(block.timestamp >= rounds[currentEpoch].closeTimestamp, "Cannot end round before closeTimestamp");
        require(rounds[currentEpoch].closePrice == 0, "Round already ended");

        Round storage round = rounds[currentEpoch];
        round.closePrice = _closePrice;

        if (_closePrice > round.lockPrice) {
            round.bullWon = true;
        } else if (_closePrice < round.lockPrice) {
            round.bearWon = true;
        } else {
            round.cancelled = true;
        }

        emit RoundEnded(currentEpoch, _closePrice, round.bullWon, round.bearWon);

        // Automatically start the next round
        currentEpoch++;
        Round storage nextRound = rounds[currentEpoch];
        nextRound.epoch = currentEpoch;
        nextRound.startTimestamp = block.timestamp;
        nextRound.lockTimestamp = block.timestamp + BUFFER_TIME;
        nextRound.closeTimestamp = block.timestamp + ROUND_LENGTH;
        
        emit RoundStarted(currentEpoch, block.timestamp);
    }

    function claim(uint256 epoch) external nonReentrant {
        require(rounds[epoch].closePrice != 0, "Round has not ended");
        UserRound storage userRound = ledger[epoch][msg.sender];
        require(!userRound.claimed, "Already claimed");

        uint256 reward = _calculateReward(epoch, msg.sender);
        if (reward > 0) {
            userRound.claimed = true;
            payable(msg.sender).transfer(reward);
            emit Claim(msg.sender, epoch, reward);
        }
    }

    function _calculateReward(uint256 epoch, address user) internal view returns (uint256) {
        Round memory round = rounds[epoch];
        UserRound memory userRound = ledger[epoch][user];

        if (round.cancelled) {
            return userRound.amount;
        }

        if ((round.bullWon && userRound.bull) || (round.bearWon && !userRound.bull)) {
            uint256 winningAmount = userRound.bull ? round.bullAmount : round.bearAmount;
            uint256 rewardAmount = (userRound.amount * round.totalAmount * (10000 - treasuryFee)) / (winningAmount * 10000);
            return rewardAmount;
        }

        return 0;
    }

    function setMinBetAmount(uint256 _minBetAmount) external onlyOwner {
        minBetAmount = _minBetAmount;
    }

    function setTreasuryFee(uint256 _treasuryFee) external onlyOwner {
        require(_treasuryFee <= 1000, "Treasury fee too high");
        treasuryFee = _treasuryFee;
    }

    function withdrawTreasury() external {
        require(msg.sender == adminAddress, "Not admin");
        uint256 amount = address(this).balance;
        payable(adminAddress).transfer(amount);
    }

    receive() external payable {}
}