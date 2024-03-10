 # Run `solcjs --bin {{filename}}.sol` to compile from command line with command line compiler
 # Run `nodejs {{filename}}.js` to compile with the solc node library 


# To Create a Post
1. open truffle console 
    `cmd: truffle console`
2. init SocialNetwork Contract
    `socialNetwork = await SocialNetwork.deployed()`
3. create a post
   ` await socialNetwork.createPost('post content')`