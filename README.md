# Simple social network app where a user can create posts and tip other posts located inside a blockchain.
# This example uses Metamask chrome extension to load an ETH wallet, Ganache to create a local EVM, Truffle to link to the EVM and Web3.js as a JS framework to interact with smart contracts

# Run `solcjs --bin {{filename}}.sol` to compile from command line with command line compiler
# Run `nodejs {{filename}}.js` to compile with the solc node library 

# Truffle commands
# To Create a Post
1. open truffle console 
    `cmd: truffle console`
2. init SocialNetwork Contract
    `socialNetwork = await SocialNetwork.deployed()`
3. create a post
   ` await socialNetwork.createPost('post content')`