const SocialNetwork = artifacts.require("SocialNetwork");
const CryptoTransactions = artifacts.require("CryptoTransactions");

module.exports = async function (deployer) {
  await deployer.deploy(SocialNetwork);
  await deployer.deploy(CryptoTransactions);
};
