import React, { createContext, useContext, useEffect } from "react";
import { useTransactions } from "../hooks/useTransactions";
import CryptoTransactions from "../../abis/CryptoTransactions.json";
import { useGlobal } from "./GlobalProvider";

interface Transaction {
  amount: number;
  closeDate: number;
  closeRate: number;
  deleted: boolean;
  id: number;
  rate: number;
  transactionDate: number;
  transactionType: "eth" | "btc";
  user: string;
}
const TransactionContext = createContext(null);

export const TransactionProvider = ({ children, web3, networkId }) => {
  const { account } = useGlobal();

  const [cryptoTransactions, setCryptoTransactions] = React.useState(null);

  useEffect(() => {
    if (web3?.eth && networkId) {
      const CryptoTransactionsNetworkData =
        CryptoTransactions.networks[networkId];
      const cryptoTransactionsContract = new web3.eth.Contract(
        CryptoTransactions.abi,
        CryptoTransactionsNetworkData.address
      );

      setCryptoTransactions(cryptoTransactionsContract);
    }
  }, [web3, networkId]);

  const {
    closeTrade,
    transactions,
    createTransactions,
    error: txnError,
    txnErrorMessage,
  } = useTransactions(account, cryptoTransactions);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        closeTrade,
        createTransactions,
        error: txnError,
        txnErrorMessage,
        cryptoTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => useContext(TransactionContext);
