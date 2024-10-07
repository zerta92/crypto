import React, { useEffect, useState } from "react";
import { useAlphavantage } from "./useAlphavantage";

export function useTransactions(account, cryptoTransactions) {
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);
  const [ethRate, setEthRate] = useState(0);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const { getCryptoData } = useAlphavantage();

  const getCurrentCryptoData = async () => {
    const EthRate = await getCryptoData("ETH");
    setEthRate(EthRate);
  };

  useEffect(() => {
    if (cryptoTransactions !== null) {
      loadTransactions();
      getCurrentCryptoData();
      setLoading(false);
    }
  }, [cryptoTransactions]);

  async function loadTransactions() {
    const userTransactions = await cryptoTransactions.methods
      .getTransactionsByUser()
      .call({ from: account });

    setTransactionsCount(userTransactions.length);
    const allTransactions = [];

    for (let id of userTransactions) {
      const post = await cryptoTransactions.methods.transactions(+id).call();
      allTransactions.push(post);
    }
    setTransactions(
      allTransactions
        .filter((_transaction) => !_transaction.deleted)
        .sort((a, b) => b.transactionDate - a.transactionDate)
    );
  }

  function createTransaction({ type, amount, transactionDate, rate }) {
    const rateToUse = rate || ethRate;
    setLoading(true);
    cryptoTransactions.methods
      .createTransaction(type, amount, transactionDate, parseInt(rateToUse))
      .send({ from: account })
      .on("confirmation", function (confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await loadTransactions();

        setLoading(false);
      })
      .on("error", function (error) {
        setLoading(false);
        setError(true);
      });
  }

  function closeTrade({ id, closeDate }) {
    const closeRate = parseInt(ethRate);
    setLoading(true);
    cryptoTransactions.methods
      .closeTrade(id, closeDate, closeRate)
      .send({ from: account })
      .on("confirmation", function (confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await loadTransactions();

        setLoading(false);
      })
      .on("error", function (error) {
        console.log({ error });
        setLoading(false);
        setError(true);
      });
  }

  return {
    transactionsCount,
    transactions,
    transactionsLoading: loading,
    transactionsError: error,
    createTransaction,
    closeTrade,
  };
}
