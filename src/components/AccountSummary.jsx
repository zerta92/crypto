import React, { useEffect, useState } from "react";
import { formatDate, fromSmallestUnit } from "./utils";
import "./App.css";
import { useGlobal } from "./context/GlobalProvider.jsx";

import { useAlphavantage } from "./hooks/useAlphavantage";
import { useTransactionContext } from "./context/TransactionContext.tsx";

function AccountSummary() {
  const { rate, symbol } = useGlobal();
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState(0);
  const { ethRate, getCoinRate } = useAlphavantage();
  const { transactions } = useTransactionContext();

  const calculateTotalMetrics = (transactions) => {
    const profit = transactions.reduce((a, b) => {
      return (
        a +
        ((+b.closeRate || ethRate) - b.rate) *
          rate *
          fromSmallestUnit(b.transactionType, b.amount)
      );
    }, 0);

    const invested = transactions.reduce((a, b) => {
      return a + rate * b.rate * fromSmallestUnit(b.transactionType, b.amount);
    }, 0);

    const profitPercent = invested ? (100 * profit) / invested : 0;

    setTotalProfit(profit.toFixed(2));
    setTotalProfitPercent(profitPercent.toFixed(2));
    setTotalInvested(invested.toFixed(2));
  };

  useEffect(() => {
    calculateTotalMetrics(transactions);
  }, [transactions, rate, ethRate]);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "75%" }}
        >
          <h1 className="text-center mb-4">Account Transaction Summary</h1>

          <div className="card-deck mb-4">
            <div className="card shadow-sm p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Invested</h5>
                <p className="card-text">
                  {symbol}
                  {totalInvested}
                </p>
              </div>
            </div>
            <div className="card shadow-sm p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Profit</h5>
                <p className="card-text">
                  {symbol}
                  {totalProfit}
                </p>
              </div>
            </div>
            <div className="card shadow-sm p-3">
              <div className="card-body text-center">
                <h5 className="card-title">Profit %</h5>
                <p className="card-text">{totalProfitPercent}%</p>
              </div>
            </div>
          </div>
          <div className="content mr-auto ml-auto">
            <div className="card mb-3 shadow-sm">
              <div className="card-header bg-dark text-white">
                All Transactions
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {" "}
                  {/* Added this div */}
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Coin</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Opened</th>
                        <th scope="col">Closed</th>
                        <th scope="col">Paid</th>
                        <th scope="col">Profit</th>
                        <th scope="col">Open Date</th>
                        <th scope="col">Close Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, key) => {
                        return (
                          <tr key={key}>
                            {/* Coin */}
                            <td>{transaction.transactionType.toUpperCase()}</td>

                            {/* Amount */}
                            <td>
                              {fromSmallestUnit(
                                transaction.transactionType,
                                transaction.amount
                              )}
                            </td>

                            {/* Opened */}
                            <td>
                              {symbol}
                              {(rate * transaction.rate).toFixed(2)}
                            </td>

                            {/* Closed */}
                            <td>
                              {symbol}
                              {+transaction.closeDate
                                ? (rate * transaction.closeRate).toFixed(2)
                                : " - "}
                            </td>

                            {/* Paid */}
                            <td>
                              {symbol}
                              {(
                                rate *
                                transaction.rate *
                                fromSmallestUnit(
                                  transaction.transactionType,
                                  transaction.amount
                                )
                              ).toFixed(2)}
                            </td>

                            {/* Profit */}
                            <td>
                              {symbol}
                              {(
                                rate *
                                ((+transaction.closeRate ||
                                  getCoinRate(transaction.transactionType)) -
                                  transaction.rate) *
                                fromSmallestUnit(
                                  transaction.transactionType,
                                  transaction.amount
                                )
                              ).toFixed(2)}
                            </td>

                            {/* Open Date */}
                            <td>{formatDate(+transaction.transactionDate)}</td>

                            {/* Close Date */}
                            <td>
                              {+transaction.closeDate
                                ? formatDate(+transaction.closeDate)
                                : " - "}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>{" "}
                {/* Closing table-responsive div */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AccountSummary;
