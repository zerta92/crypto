import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import Main from "./Main";
import SocialNetwork from "../abis/SocialNetwork.json";
import Modal from "./Modal";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true,
      error: false,
    };

    this.createPost = this.createPost.bind(this);
    this.tipPost = this.tipPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async loadWeb3() {
    const options = {
      transactionConfirmationBlocks: 1,
    };
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum, null, options);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider, null, options);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You Should consider trying MetaMask!"
      );
    }
  }

  async loadPosts() {
    const postCount = await this.state.socialNetwork.methods
      .postsCount()
      .call();

    this.setState({ postCount });
    for (let i = 1; i <= postCount; i++) {
      const post = await this.state.socialNetwork.methods.posts(i).call();

      const isInPosts = this.state.posts.find(
        (post_) => post_.id.toNumber() === post.id.toNumber()
      );

      if (!isInPosts) {
        this.setState({ posts: [...this.state.posts, post] });
      }
    }
    this.setState({
      posts: this.state.posts
        .filter((post) => !post.deleted)
        .sort((a, b) => b.tipAmount - a.tipAmount),
    });
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });

    const networkId = await new web3.eth.net.getId();
    const networkData = SocialNetwork.networks[networkId];
    if (networkData) {
      const socialNetwork = web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );

      this.setState({ socialNetwork });

      await this.loadPosts();

      this.setState({ loading: false });
    } else {
      window.alert("SocialNetwork contract has not deployed to the network.");
    }
  }

  createPost(content) {
    this.setState({ loading: true });
    this.state.socialNetwork.methods
      .createPost(content)
      .send({ from: this.state.account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await this.loadPosts();

        this.setState({
          loading: false,
        });
      })
      .on("error", function(error) {
        this.setState({ error: true, loading: false });
      });
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true });
    this.state.socialNetwork.methods
      .tipPost(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        this.setState({ loading: false });
      })
      .on("error", function(error) {
        this.setState({ error: true, loading: false });
      });
  }

  deletePost(id) {
    this.setState({ loading: true });
    this.state.socialNetwork.methods
      .deletePost(id)
      .send({ from: this.state.account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        this.setState({
          loading: false,
          posts: this.state.posts.filter((post) => {
            return post.id.toNumber() !== +id;
          }),
        });
      })
      .on("error", function(error) {
        this.setState({ error: true, loading: false });
      });
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  handleClose = () => {
    this.setModalOpen(false);
  };

  handleOpen = () => {
    this.setModalOpen(true);
  };

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <Main
              posts={this.state.posts}
              createPost={this.createPost}
              tipPost={this.tipPost}
              deletePost={this.deletePost}
              account={this.state.account}
            />
            <div>
              {" "}
              <Modal isOpen={this.modalOpen} onClose={this.handleClose}>
                <>
                  <h1>GFG</h1>
                  <h3>A computer science portal!</h3>
                </>
              </Modal>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default App;
