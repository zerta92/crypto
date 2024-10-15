const SocialNetwork = artifacts.require("SocialNetwork");
const CryptoTransactions = artifacts.require("CryptoTransactions");

module.exports = async function (deployer) {
  const CryptoTransactionsGasEstimate = await web3.eth.estimateGas({
    data: CryptoTransactions.bytecode,
  });
  const SocialNetworkGasEstimate = await web3.eth.estimateGas({
    data: SocialNetwork.bytecode,
  });
  console.log({ CryptoTransactionsGasEstimate });
  console.log({ SocialNetworkGasEstimate });
  // await deployer.deploy(SocialNetwork);
  await deployer.deploy(CryptoTransactions);
};
