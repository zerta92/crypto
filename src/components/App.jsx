import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import Posts from "./Posts";
import Modal from "./Modal";
import AccountSummary from "./AccountSummary";
import PurchaseForm from "./PurchaseForm";
import Transactions from "./transactions/Transactions";
import SocialNetwork from "../abis/SocialNetwork.json";
import CryptoTransactions from "../abis/CryptoTransactions.json";
import { GlobalProvider } from "./context/GlobalProvider";

function App() {
  const [modalOpen, setOpen] = React.useState(false);
  const [account, setAccount] = React.useState("");
  const [socialNetwork, setSocialNetwork] = React.useState(null);
  const [cryptoTransactions, setCryptoTransactions] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    async function loadBlockChain() {
      await loadWeb3();
      await loadBlockchainData();
    }
    loadBlockChain();
  }, []);

  async function loadWeb3() {
    const options = {
      transactionConfirmationBlocks: 1,
    };

    if (window.ethereum) {
      if (false && process.env.REACT_APP_NODE_ENV === "production") {
        window.web3 = new Web3(
          new Web3.providers.HttpProvider(
            `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
          )
        );
      } else {
        window.web3 = new Web3(window.ethereum, null, options);
      }

      await window.ethereum.enable();
    } else if (window.web3) {
      if (false && process.env.REACT_APP_NODE_ENV === "production") {
        window.web3 = new Web3(
          new Web3.providers.HttpProvider(
            `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
          )
        );
      } else {
        window.web3 = new Web3(window.web3.currentProvider, null, options);
      }
    } else {
      window.alert(
        "Non-Ethereum browser detected. You Should consider trying MetaMask!"
      );
    }
  }

  async function getNetworkId(web3) {
    try {
      const networkId = await web3.eth.net.getId();
      console.log("Network ID:", networkId);
      return networkId;
    } catch (error) {
      console.error("Error fetching network ID:", error);
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;

    // const accounts = await web3.eth.getAccounts();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);

    const networkId = await getNetworkId(web3);

    //SocialNetwork Contract
    const networkData = SocialNetwork.networks[networkId];
    if (networkData) {
      const socialNetwork = new web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );

      setSocialNetwork(socialNetwork);

      //CryptoTransactions Contract
      const CryptoTransactionsNetworkData =
        CryptoTransactions.networks[networkId];

      const cryptoTransactions = new web3.eth.Contract(
        CryptoTransactions.abi,
        CryptoTransactionsNetworkData.address
      );

      setCryptoTransactions(cryptoTransactions);

      setLoading(false);
    } else {
      window.alert("SocialNetwork contract has not deployed to the network.");
    }
  }

  /* Modal */
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const router = createBrowserRouter([
    {
      path: "/transactions",
      element: (
        <div>
          {" "}
          <Transactions
            cryptoTransactions={cryptoTransactions}
            account={account}
          />
        </div>
      ),
    },
    {
      path: "/posts",
      element: (
        <div>
          <Posts socialNetwork={socialNetwork} account={account} />
        </div>
      ),
    },
    {
      path: "/",
      element: (
        <div>
          <AccountSummary
            cryptoTransactions={cryptoTransactions}
            account={account}
          />
        </div>
      ),
    },
  ]);

  return (
    <div>
      <GlobalProvider>
        <Navbar
          account={account}
          handleModalOpen={handleOpen}
          handleModalClose={handleClose}
        />
        {loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <RouterProvider router={router} />
          </>
        )}
        <>
          <Modal isOpen={modalOpen} onClose={handleClose}>
            <>
              <PurchaseForm
                account={account}
                cryptoTransactions={cryptoTransactions}
                handleModalClose={handleClose}
              ></PurchaseForm>
            </>
          </Modal>
        </>
      </GlobalProvider>
    </div>
  );
}

export default App;
