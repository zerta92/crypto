import React, { useState, useRef, useEffect } from "react";
import Identicon from "identicon.js";
import { formatDate, fromSmallestUnit, convertToUsd } from "../utils";
import "../App.css";
import { useGlobal } from "../context/GlobalProvider.jsx";
import CsvReader from "../csv-reader/CsvReader.jsx";
import { useTransactions } from "../hooks/useTransactions.jsx";
import { useAlphavantage } from "../hooks/useAlphavantage";

function Transactions({ account, cryptoTransactions }) {
  const { currency, rate, symbol } = useGlobal();
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [dateError, setDateError] = useState(false);

  const [saleRate, setSaleRate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(-1);

  const { getCoinRate } = useAlphavantage();

  const { closeTrade, transactions } = useTransactions(
    account,
    cryptoTransactions
  );

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const handleCloseTrade = (transaction, key) => {
    if (datePickerRef.current?.value) {
      closeTrade({
        id: transaction.id,
        closeDate: new Date(selectedDate).getTime(),
        saleRateUsd: convertToUsd(saleRate, rate),
      });
      datePickerRef.current.value = null;
      setSaleRate("");
      setShowDatePicker(-1);
    } else {
      setSaleRate(
        getCoinRate(transaction.transactionType) *
          rate *
          fromSmallestUnit(transaction.transactionType, transaction.amount)
      );

      setShowDatePicker(key);
    }
  };
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
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col">
                          <p>
                            {fromSmallestUnit(
                              transaction.transactionType,
                              transaction.amount
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
                                (+transaction.closeRate ||
                                  getCoinRate(transaction.transactionType)) *
                                  rate *
                                  fromSmallestUnit(
                                    transaction.transactionType,
                                    transaction.amount
                                  )
                              )}
                              {currency}
                            </b>
                          </p>
                        </div>
                      </div>
                    </li>

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
                      {/* Datepicker */}
                      {showDatePicker === key ? (
                        <div className="mt-5 p-4 bg-light rounded shadow-sm">
                          {/* Sale Rate Input */}
                          <div className="mb-4">
                            <label
                              htmlFor="cryptoAmountValue"
                              className="form-label font-weight-bold"
                            >
                              Enter Sale Rate
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  {symbol}
                                </span>
                              </div>
                              <input
                                type="number"
                                className="form-control"
                                id="cryptoAmountValue"
                                placeholder={`Enter value in ${currency}`}
                                value={saleRate}
                                onChange={(e) => setSaleRate(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Date Picker Input */}
                          <div className="mb-3">
                            <label
                              htmlFor="datePicker"
                              className="form-label font-weight-bold"
                            >
                              Select Closing Date
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="fas fa-calendar-alt"></i>{" "}
                                  {/* Calendar Icon */}
                                </span>
                              </div>
                              <input
                                type="date"
                                className={`form-control ${
                                  dateError ? "is-invalid" : ""
                                }`}
                                id="datePicker"
                                ref={datePickerRef}
                                value={selectedDate}
                                required
                                onChange={(e) => {
                                  setSelectedDate(e.target.value);
                                  setDateError(null);
                                }}
                              />
                              {dateError && (
                                <div className="invalid-feedback">
                                  Please select a closing date.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* Close Trade Button */}

                      {account === transaction.user ? (
                        !+transaction.closeDate ? (
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={transaction.id}
                            onClick={(event) => {
                              handleCloseTrade(transaction, key);
                            }}
                          >
                            {showDatePicker === key ? "CONFIRM" : "CLOSE TRADE"}
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
            <CsvReader
              account={account}
              cryptoTransactions={cryptoTransactions}
            ></CsvReader>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Transactions;
