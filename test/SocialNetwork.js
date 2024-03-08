const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", (accounts) => {
  let socialNetwork;

  describe("deployment", () => {
    it("deploys successfully", async () => {
      socialNetwork = await SocialNetwork.deployed();

      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
    });
  });
});
