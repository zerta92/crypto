import React, { useEffect, useState } from "react";
import Identicon from "identicon.js";
import { formatDate } from "../utils";
import "../App.css";
import { useGlobal } from "../context/GlobalProvider.jsx";

import { useTransactions } from "../hooks/useTransactions.jsx";
import { useAlphavantage } from "../hooks/useAlphavantage";

function Transactions({ account, cryptoTransactions }) {
  const { currency, rate } = useGlobal();

  const { ethRate, btcRate } = useAlphavantage();

  const { closeTrade, transactions } = useTransactions(
    account,
    cryptoTransactions
  );

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
            {transactions.map((transaction, key) => {
              return (
                <div className="card mb-4" key={key}>
                  <div className="card-header">
                    <img
                      alt=""
                      className="mr-2"
                      width="30"
                      height="30"
                      src={`data:image/png;base64,${new Identicon(
                        transaction.user,
                        30
                      ).toString()}`}
                    />
                  </div>
                  <ul id="postList" className="list-group list-group-flush">
                    {/* Ethereum  */}
                    {transaction.transactionType === "eth" ? (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col">
                            <p>
                              {window.web3.utils.fromWei(
                                transaction.amount.toString(),
                                "Ether"
                              )}{" "}
                              {transaction.transactionType}
                            </p>
                          </div>
                          <div className="col">
                            <p className="float-right">
                              Current Value:
                              <b>
                                {" "}
                                &nbsp;
                                {Math.round(
                                  (+transaction.closeRate || ethRate) *
                                    rate *
                                    window.web3.utils.fromWei(
                                      transaction.amount.toString(),
                                      "Ether"
                                    )
                                )}
                                {currency}
                              </b>
                            </p>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <></>
                    )}
                    {/* Bitcoin  */}
                    {transaction.transactionType === "btc" ? (
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col">
                            <p>
                              {transaction.amount / 1e8}{" "}
                              {transaction.transactionType}
                            </p>
                          </div>
                          <div className="col">
                            <p className="float-right">
                              Current Value:
                              <b>
                                {" "}
                                &nbsp;
                                {Math.round(
                                  (+transaction.closeRate || btcRate) *
                                    rate *
                                    (transaction.amount / 1e8)
                                )}
                                {currency}
                              </b>
                            </p>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <></>
                    )}

                    <li key={key} className="list-group-item py-2">
                      <small className="float-left mt-1 text-muted pr-3">
                        Opened: {formatDate(+transaction.transactionDate)}
                      </small>
                      {+transaction.closeDate ? (
                        <small className="float-left mt-1 text-muted">
                          Closed: {formatDate(+transaction.closeDate)}
                        </small>
                      ) : (
                        <></>
                      )}

                      {account === transaction.user ? (
                        !+transaction.closeDate ? (
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={transaction.id}
                            onClick={(event) => {
                              closeTrade({
                                id: transaction.id,
                                closeDate: new Date().getTime(),
                              });
                            }}
                          >
                            CLOSE TRADE
                          </button>
                        ) : (
                          <div className="float-right pt-0">CLOSED</div>
                        )
                      ) : (
                        <div></div>
                      )}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Transactions;
