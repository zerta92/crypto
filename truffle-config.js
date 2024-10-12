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
      network_id: 11155111, // Sepolia network ID
      gas: 5500000, // Gas limit (can adjust based on contract)
      confirmations: 2, // Wait for 2 confirmations
      skipDryRun: true, // Skip dry run before migrations
      networkCheckTimeout: 1000000,
      skipDryRun: true, // Skip dry run before migrations
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
      version: "0.5.0", // Solidity version
    },
  },
};

// module.exports = {
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "*" // Match any network id
//     },
//   },
//   contracts_directory: './src/contracts/',
//   contracts_build_directory: './src/abis/',
//   compilers: {
//     solc: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   }
// }
