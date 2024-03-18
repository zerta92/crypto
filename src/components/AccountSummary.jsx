import React, { useEffect, useState } from "react";
import { formatDate } from "./utils";
import "./App.css";
import { useGlobal } from "./context/GlobalProvider.jsx";

import { useTransactions } from "./hooks/useTransactions.jsx";
import { useAlphavantage } from "./hooks/useAlphavantage";
function AccountSummary({ account, cryptoTransactions }) {
  const { rate, symbol } = useGlobal();

  const [totalProfit, setTotalProfit] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfitPercent, setTotalProfitPercent] = useState(0);
  const [ethRate, setEthRate] = useState(0);
  const { getCryptoData } = useAlphavantage();
  const { transactions } = useTransactions(account, cryptoTransactions);

  const getCurrentCryptoData = async () => {
    const EthRate = await getCryptoData("ETH");
    setEthRate(EthRate);
  };

  const calculateTotalMetrics = (transactions) => {
    const profit = transactions.reduce((a, b) => {
      return (
        a +
        ((+b.closeRate || ethRate) - b.rate) *
          rate *
          +window.web3.utils.fromWei(b.amount.toString(), "Ether")
      );
    }, 0);

    const invested = transactions.reduce((a, b) => {
      return (
        a +
        rate * b.rate * +window.web3.utils.fromWei(b.amount.toString(), "Ether")
      );
    }, 0);

    const profitPercent = invested ? (100 * profit) / invested : 0;

    setTotalProfit(profit.toFixed(2));
    setTotalProfitPercent(profitPercent.toFixed(2));
    setTotalInvested(invested.toFixed(2));
  };

  useEffect(() => {
    calculateTotalMetrics(transactions);
    getCurrentCryptoData("ETH");
  }, [transactions, rate]);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "750px" }}
        >
          <h1>Transaction Summary</h1>

          <div style={{ marginBottom: "45px" }}>
            <table className="table">
              <thead className="bg-dark text-white shadow">
                <tr>
                  <th scope="col">Invested</th>
                  <th scope="col">Profit</th>
                  <th scope="col">Profit %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {symbol}
                    {totalInvested}
                  </td>
                  <td>
                    {symbol}
                    {totalProfit}
                  </td>
                  <td>{totalProfitPercent}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="content mr-auto ml-auto">
            {transactions.map((transaction, key) => {
              return (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Opened</th>
                      <th scope="col">Closed</th>
                      <th scope="col">Investment</th>
                      <th scope="col">Profit</th>
                      <th scope="col">Open Date</th>
                      <th scope="col">Close Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* Coin */}
                      <td>{transaction.transactionType.toUpperCase()}</td>
                      {/* Amount */}
                      <td>
                        {window.web3.utils.fromWei(
                          transaction.amount.toString(),
                          "Ether"
                        )}
                      </td>
                      {/* Opened */}
                      <td>
                        {symbol}
                        {rate * transaction.rate}
                      </td>
                      {/* Closed */}
                      <td>
                        {symbol}
                        {+transaction.closeDate
                          ? rate * transaction.closeRate
                          : " - "}
                      </td>
                      {/* Initial Value  */}
                      <td>
                        {symbol}
                        {(
                          rate *
                          transaction.rate *
                          window.web3.utils.fromWei(
                            transaction.amount.toString(),
                            "Ether"
                          )
                        ).toFixed(2)}
                      </td>
                      {/* Profit  */}
                      <td>
                        {symbol}
                        {(
                          rate *
                          ((+transaction.closeRate || ethRate) -
                            transaction.rate) *
                          window.web3.utils.fromWei(
                            transaction.amount.toString(),
                            "Ether"
                          )
                        ).toFixed(2)}
                      </td>
                      {/* Open Date  */}
                      <td>{formatDate(+transaction.transactionDate)}</td>
                      {/* Close Date  */}
                      <td>
                        {" "}
                        {+transaction.closeDate
                          ? formatDate(+transaction.closeDate)
                          : " - "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AccountSummary;
