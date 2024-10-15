require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.REACT_APP_DEPLOYER_PRIVATE_KEY,
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_PROJECT_ID}`
        ),
      network_id: 11155111,
      skipDryRun: false,
      confirmations: 2,
      networkCheckTimeout: 1000000000,
      gas: 3000000, // Adjust gas limit as necessary
      gasPrice: 10179180429, // 20 gwei (adjust for current network conditions)
    },
    ["linea-sepolia"]: {
      provider: () =>
        new HDWalletProvider(
          process.env.REACT_APP_DEPLOYER_PRIVATE_KEY,
          `https://linea-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_PROJECT_ID}`
        ),
      network_id: 59141,
      skipDryRun: false,
      confirmations: 2,
      networkCheckTimeout: 1000000000,
      gas: 3000000, // Adjust gas limit as necessary
      gasPrice: 10179180429, // 20 gwei (adjust for current network conditions)
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          process.env.REACT_APP_DEPLOYER_PRIVATE_KEY,
          `https://eth.mainnetxxx.g.alchemy.io/v3/${process.env.REACT_APP_ALCHEMY_PROJECT_ID}` //added xxx for safety
        ),
      network_id: 1, // Mainnet network ID
      gas: 5500000, // Adjust gas limit as necessary
      gasPrice: 20000000000, // 20 gwei (adjust for current network conditions)
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "0.8.0", // Solidity version
    },
  },
};
