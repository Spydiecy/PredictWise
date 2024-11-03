require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("Please set your PRIVATE_KEY in a .env file");
  process.exit(1);
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    aiatestnet: {
      url: "https://aia-dataseed1-testnet.aiachain.org",
      chainId: 1320,
      accounts: [`0x${PRIVATE_KEY}`],
      timeout: 100000
    }
  },
  etherscan: {
    apiKey: {
      aiatestnet: "no-api-key-needed"
    },
    customChains: [
      {
        network: "aiatestnet",
        chainId: 1320,
        urls: {
          apiURL: "https://testnet.aiachain.org/api",
          browserURL: "https://testnet.aiachain.org"
        }
      }
    ]
  }
};