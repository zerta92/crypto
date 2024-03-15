import React, { useEffect } from "react";

export function useTransactions(account, cryptoTransactions) {
  const [transactionsCount, setTransactionsCount] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    if (cryptoTransactions !== null) {
      loadTransactions();
      setLoading(false);
    }
  }, [cryptoTransactions]);

  async function loadTransactions() {
    const transactionsCount = await cryptoTransactions.methods
      .transactionsCount()
      .call();

    setTransactionsCount(transactionsCount);
    const allTransactions = [];
    for (let i = 1; i <= transactionsCount; i++) {
      const post = await cryptoTransactions.methods.transactions(i).call();

      allTransactions.push(post);
    }
    setTransactions(
      allTransactions
        .filter((_transaction) => !_transaction.deleted)
        .sort((a, b) => b.transactionDate - a.transactionDate)
    );
  }

  function createTransaction({ type, amount, transactionDate }) {
    const rate = 1.23 * 1000;
    setLoading(true);
    cryptoTransactions.methods
      .createTransaction(type, amount, transactionDate, rate)
      .send({ from: account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await loadTransactions();

        setLoading(false);
      })
      .on("error", function(error) {
        setLoading(false);
        setError(true);
      });
  }

  function closeTrade({ id, closeDate }) {
    const closeRate = 2.8 * 1000;
    setLoading(true);
    cryptoTransactions.methods
      .closeTrade(id, closeDate, closeRate)
      .send({ from: account })
      .on("confirmation", function(confirmationNumber, receipt) {})
      .on("receipt", async (receipt) => {
        await loadTransactions();

        setLoading(false);
      })
      .on("error", function(error) {
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
