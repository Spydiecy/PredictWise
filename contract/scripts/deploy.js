const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment of PredictionGame...");

    // Get the deployer's signer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance));

    // Constructor parameters
    const minBetAmount = hre.ethers.parseEther("0.01"); // 0.01 AIA as minimum bet
    const treasuryFee = 300; // 3% fee (300 basis points)
    const adminAddress = deployer.address; // Using deployer as admin

    // Deploy PredictionGame
    const PredictionGame = await hre.ethers.getContractFactory("PredictionGame", deployer);
    console.log("Deploying PredictionGame...");
    const predictionGame = await PredictionGame.deploy(
      minBetAmount,
      treasuryFee,
      adminAddress
    );

    await predictionGame.waitForDeployment();
    const contractAddress = await predictionGame.getAddress();

    console.log("PredictionGame deployed to:", contractAddress);
    console.log("Constructor parameters:");
    console.log("- Minimum bet amount:", hre.ethers.formatEther(minBetAmount), "AIA");
    console.log("- Treasury fee:", treasuryFee/100, "%");
    console.log("- Admin address:", adminAddress);
    
    // Wait for block confirmations
    console.log("Waiting for block confirmations...");
    await predictionGame.deploymentTransaction().wait(5);
    console.log("Deployment confirmed!");

    // Start the first round
    try {
      console.log("Starting first round...");
      const startTx = await predictionGame.startRound();
      await startTx.wait();
      console.log("First round started successfully!");
    } catch (error) {
      console.log("Failed to start first round:", error.message);
    }

    // Verify contract
    try {
      console.log("Verifying contract...");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
          minBetAmount,
          treasuryFee,
          adminAddress
        ]
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }

  } catch (error) {
    console.error("Deployment error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });