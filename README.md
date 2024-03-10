# Simple social network app where a user can create posts and tip other posts located inside a blockchain.
### <p>This example uses Metamask chrome extension to load an ETH wallet, Ganache to create a local EVM, Truffle to link to the EVM and Web3.js as a JS framework to interact with smart contracts</p>

### Run `truffle migrate --reset` to run migrations and deploy smart contract to the EVM


## Truffle commands
### To Create a Post from the terminal
1. open truffle console 
    `cmd: truffle console`
2. init SocialNetwork Contract
    `socialNetwork = await SocialNetwork.deployed()`
3. create a post
   ` await socialNetwork.createPost('post content')`