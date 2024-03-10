import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import Main from "./Main";
import SocialNetwork from "../abis/SocialNetwork.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true,
    };

    this.createPost = this.createPost.bind(this);
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
      const postCount = await socialNetwork.methods.postsCount().call();
      this.setState({ postCount });
      for (let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call();
        this.setState({ posts: [...this.state.posts, post] });
      }

      this.setState({ loading: false });
    } else {
      window.alert("SocialNetwork contract has not deployed to the network.");
    }
  }

  createPost(content) {
    this.setState({ loading: true });
    console.log("started: ", this.state.account);
    this.state.socialNetwork.methods
      .createPost(content)
      .send({ from: this.state.account })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log({ receipt });
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
        this.setState({ loading: false });
      });
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            createPost={this.createPost}
            tipPost={this.tipPost}
          />
        )}
      </div>
    );
  }
}

export default App;
