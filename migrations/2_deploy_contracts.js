const SocialNetwork = artifacts.require("SocialNetwork");
const CryptoTransactions = artifacts.require("CryptoTransactions");

module.exports = function(deployer) {
  deployer.deploy(SocialNetwork);
  deployer.deploy(CryptoTransactions);
};
