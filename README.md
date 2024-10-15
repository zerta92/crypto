# Simple crypto logs app where a user can log crypto transactions - Uses Sepolia blockchain
### <p>This example uses Metamask chrome extension to load an ETH wallet, Ganache to create a local EVM, Truffle to link to the EVM and Web3.js as a JS framework to interact with smart contracts</p>

### Go to `https://faucet.quicknode.com/ethereum/sepolia` to request Sepolia ETH

### Build `truffle build` to build migration
### Migrate Local `truffle migrate --reset` to run migrations and deploy smart contracts to the local Ganache EVM
### Migrate to specific network `truffle migrate --network sepolia` to run migrations and deploy smart contracts to the Sepolia testnet
### Migrate specific file to network `truffle migrate --f 2 --to 2 --reset --network sepolia` to run deployment file 2 only


## Truffle commands
### To Create a Post from the terminal
1. open truffle console 
    `cmd: truffle console`
2. init SocialNetwork Contract
    `socialNetwork = await SocialNetwork.deployed()`
3. create a post
   ` await socialNetwork.createPost('post content')`