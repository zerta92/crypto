import React, { useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./Navbar";
import Posts from "./Posts";
import Transactions from "./transactions/Transactions";
import SocialNetwork from "../abis/SocialNetwork.json";
import Modal from "./Modal";
import PurchaseForm from "./PurchaseForm";
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

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    setAccount(accounts[0]);

    const networkId = await new web3.eth.net.getId();

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

  return (
    <div>
      <GlobalProvider>
        <Navbar account={account} handleModalOpen={handleOpen} />
        {loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div>
              <div>
                <Transactions
                  cryptoTransactions={cryptoTransactions}
                  account={account}
                />
                <div>
                  <Posts socialNetwork={socialNetwork} account={account} />
                </div>
              </div>
            </div>
            <div>
              {" "}
              <Modal isOpen={modalOpen} onClose={handleClose}>
                <>
                  <PurchaseForm
                    account={account}
                    cryptoTransactions={cryptoTransactions}
                  ></PurchaseForm>
                </>
              </Modal>
            </div>
          </>
        )}
      </GlobalProvider>
    </div>
  );
}

export default App;
