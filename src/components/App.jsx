import React, { Component, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import Main from "./Main";
import SocialNetwork from "../abis/SocialNetwork.json";
import Modal from "./Modal";
import PurchaseForm from "./PurchaseForm";
import CryptoTransactions from "../abis/CryptoTransactions.json";

function App() {
  const [modalOpen, setOpen] = React.useState(false);
  const [account, setAccount] = React.useState("");
  const [socialNetwork, setSocialNetwork] = React.useState(null);
  const [cryptoTransactions, setCryptoTransactions] = React.useState(null);
  const [postCount, setPostCount] = React.useState(0);
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [posts, setPosts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    async function loadBlockChain() {
      await loadWeb3();
      await loadBlockchainData();
    }
    loadBlockChain();
  }, []);

  useEffect(() => {
    if (socialNetwork !== null) {
      loadPosts();
      setLoading(false);
    }
  }, [socialNetwork]);

  useEffect(() => {
    if (cryptoTransactions !== null) {
      loadTransactions();
      setLoading(false);
    }
  }, [cryptoTransactions]);

  async function loadWeb3() {
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

  async function loadPosts() {
    const postCount = await socialNetwork.methods.postsCount().call();

    setPostCount(postCount);
    const allPosts = [];
    for (let i = 1; i <= postCount; i++) {
      const post = await socialNetwork.methods.posts(i).call();

      const isInPosts = posts.find(
        (post_) => post_.id.toNumber() === post.id.toNumber()
      );

      if (!isInPosts) {
        allPosts.push(post);
      }
    }
    setPosts(
      allPosts
        .filter((post) => !post.deleted)
        .sort((a, b) => b.tipAmount - a.tipAmount)
    );
  }

  async function loadTransactions() {
    const transactionsCount = await cryptoTransactions.methods
      .transactionsCount()
      .call();

    setTransactionsCount(transactionsCount);
    const allPosts = [];
    for (let i = 1; i <= transactionsCount; i++) {
      const post = await cryptoTransactions.methods.transactions(i).call();

      allPosts.push(post);
    }
    setTransactions(
      allPosts
        .filter((_transaction) => !_transaction.deleted)
        .sort((a, b) => b.transactionDate - a.transactionDate)
    );
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts[0]);

    const networkId = await new web3.eth.net.getId();

    //SocialNetwork Contract
    const networkData = SocialNetwork.networks[networkId];
    if (networkData) {
      const socialNetwork = web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );

      setSocialNetwork(socialNetwork);

      //CryptoTransactions Contract
      const CryptoTransactionsNetworkData =
        CryptoTransactions.networks[networkId];

      const cryptoTransactions = web3.eth.Contract(
        CryptoTransactions.abi,
        CryptoTransactionsNetworkData.address
      );

      setCryptoTransactions(cryptoTransactions);

      setLoading(false);
    } else {
      window.alert("SocialNetwork contract has not deployed to the network.");
    }
  }

  function createPost(content) {
    setLoading(true);
    socialNetwork.methods
      .createPost(content)
      .send({ from: account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await loadPosts();

        setLoading(false);
      })
      .on("error", function(error) {
        setLoading(false);
        setError(true);
      });
  }

  function tipPost(id, tipAmount) {
    setLoading(true);
    socialNetwork.methods
      .tipPost(id)
      .send({ from: account, value: tipAmount })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        setLoading(false);
      })
      .on("error", function(error) {
        setLoading(false);
        setError(true);
      });
  }

  function deletePost(id) {
    setLoading(true);
    socialNetwork.methods
      .deletePost(id)
      .send({ from: account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", (receipt) => {
        setLoading(false);
        setPosts(
          posts.filter((post) => {
            return post.id.toNumber() !== +id;
          })
        );
      })
      .on("error", function(error) {
        setLoading(false);
        setError(true);
      });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Navbar account={account} handleModalOpen={handleOpen} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Main
            posts={posts}
            createPost={createPost}
            tipPost={tipPost}
            deletePost={deletePost}
            account={account}
          />
          <div>
            {" "}
            <Modal isOpen={modalOpen} onClose={handleClose}>
              <>
                <PurchaseForm></PurchaseForm>
              </>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
