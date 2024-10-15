import React, { useEffect } from "react";

export function useTransactions(account, cryptoTransactions) {
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    if (cryptoTransactions) {
      loadTransactions();
      setLoading(false);
    }
  }, [cryptoTransactions]);

  const transactionBigIntToNumberKeys = [
    "amount",
    "closeDate",
    "closeRate",
    "id",
    "rate",
    "transactionDate",
  ];
  async function loadTransactions() {
    const userTransactions = await cryptoTransactions.methods
      .getTransactionsByUser()
      .call({ from: account });

    setTransactionsCount(userTransactions.length);
    const allTransactions = [];

    for (let id of userTransactions) {
      const post = await cryptoTransactions.methods.transactions(id).call();
      Object.keys(post).forEach((key) => {
        if (transactionBigIntToNumberKeys.includes(key)) {
          post[key] = Number(post[key]);
        }
      });
      allTransactions.push(post);
    }

    setTransactions(
      allTransactions
        .filter((_transaction) => !_transaction.deleted)
        .sort((a, b) => Number(b.transactionDate) - Number(a.transactionDate))
    );
  }

  async function createTransactions(transactions) {
    setLoading(true);

    const formattedTransactions = transactions.map((transaction) => {
      const { type, amount, transactionDate, rate } = transaction;
      return [type, amount, transactionDate, parseInt(rate)];
    });

    await createTransaction(formattedTransactions);
    setLoading(false);
    await loadTransactions();
  }

  function createTransaction(transactions) {
    return new Promise((resolve, reject) => {
      // const gasLimit = 2000000;
      cryptoTransactions.methods
        .createTransactions(transactions)
        .send({
          from: account,
          // gas: gasLimit, // Set the gas limit
          // gasPrice: window.web3.utils.toWei("11", "gwei"),
        })
        .on("confirmation", function (confirmationNumber, receipt) {})
        .on("receipt", async (receipt) => {
          setLoading(false);
          setError(false);
          resolve();
        })
        .on("error", function (error) {
          setLoading(false);
          setError(true);
          resolve();
        })
        .catch((err) => {
          setLoading(false);
          setError(true);
          setErrorMessage(err?.message ?? "There was an error");
          resolve();
        });
    });
  }

  function closeTrade({ id, closeDate, saleRateUsd }) {
    const closeRate = parseInt(saleRateUsd);
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
    createTransactions,
    closeTrade,
    errorMessage,
    error,
  };
}
