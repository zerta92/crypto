const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });
  describe("deployment", () => {
    it("deploys successfully", async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await socialNetwork.name();
      assert.equal(name, "Fuck Boy University Social Network");
    });
  });

  describe("posts", () => {
    let result, postsCount;
    it("creates a post", async () => {
      result = await socialNetwork.createPost("This is my first post.", {
        from: author,
      });

      postsCount = await socialNetwork.postsCount();
      assert.equal(postsCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postsCount.toNumber(), "id is correct");
      assert.equal(
        event.content,
        "This is my first post.",
        "content is correct"
      );
      assert.equal(event.tipAmount, "0", "tip is correct");
      assert.equal(event.author, author, "author is correct");

      //Fails
      result = await socialNetwork.createPost("", {
        from: author,
      }).should.be.rejected;
    });
    it("lists a post", async () => {});
    it("allows users to tip posts", async () => {});
  });
});
