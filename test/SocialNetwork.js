/* eslint-disable no-undef */
const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  console.log({ deployer, author, tipper });

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

    before(async () => {
      result = await socialNetwork.createPost("This is my first post.", {
        from: author,
      });
      postsCount = await socialNetwork.postsCount();
    });
    it("creates a post", async () => {
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

    it("lists a post", async () => {
      const post = await socialNetwork.posts(postsCount);
      assert.equal(post.id.toNumber(), postsCount.toNumber(), "id is correct");
      assert.equal(
        post.content,
        "This is my first post.",
        "content is correct"
      );
      assert.equal(post.tipAmount, "0", "tip is correct");
      assert.equal(post.author, author, "author is correct");
    });
    it("allows users to tip posts", async () => {
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await socialNetwork.tipPost(postsCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      });
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postsCount.toNumber(), "id is correct");
      assert.equal(
        event.content,
        "This is my first post.",
        "content is correct"
      );
      assert.equal(event.tipAmount, "1000000000000000000", "tip is correct");
      assert.equal(event.author, author, "author is correct");

      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipAmount;
      tipAmount = web3.utils.toWei("1", "Ether");
      tipAmount = new web3.utils.BN(tipAmount);

      const expectedAuthorBalance = oldAuthorBalance.add(tipAmount);
      assert.equal(
        newAuthorBalance.toString(),
        expectedAuthorBalance.toString()
      );

      //Fail
      result = await socialNetwork.tipPost(99, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });

    it("deletes a post", async () => {
      // result = await socialNetwork.deletePost(1, {
      //   from: author,
      // });
      // const event = result.logs[0].args;
      // assert.equal(
      //   event.postsCount.toNumber(),
      //   postsCount.toNumber() - 1,
      //   "id is correct"
      // );
    });
  });
});
