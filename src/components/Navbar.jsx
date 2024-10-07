import React from "react";
import Identicon from "identicon.js";
import { useGlobal, useDispatchGlobal } from "./context/GlobalProvider.jsx";
import { useAlphavantage } from "./hooks/useAlphavantage";

function Navbar({ account, handleModalOpen }) {
  const { currency, symbol, rate } = useGlobal();
  const { ethRate } = useAlphavantage();
  const dispatchGlobal = useDispatchGlobal();

  const toggleCurrency = (currency) => {
    if (currency === "GBP") {
      return "USD";
    }
    return "GBP";
  };

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_self"
          rel="noopener noreferrer"
        >
          Summary
        </a>

        <div className="d-flex align-items-center">
          <span className="navbar-brand mr-3">
            ETH: {symbol}
            {(ethRate * rate).toFixed(2)}
          </span>

          <a
            className="nav-item nav-link"
            href="/transactions"
            target="_self"
            rel="noopener noreferrer"
          >
            Transactions
          </a>

          <a
            className="nav-item nav-link"
            href="/posts"
            target="_self"
            rel="noopener noreferrer"
          >
            Notes
          </a>

          <a
            href="/"
            className="nav-item nav-link"
            onClick={(event) => {
              event.preventDefault();
              handleModalOpen();
            }}
          >
            Log
          </a>

          <a
            className="nav-item nav-link"
            href="/"
            target="_self"
            onClick={(event) => {
              event.preventDefault();
              dispatchGlobal({
                type: "setCurrency",
                payload: toggleCurrency(currency),
              });
            }}
          >
            {currency}
          </a>
        </div>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
              {account ? (
                <img
                  alt=""
                  className="ml-2"
                  height="30"
                  width="30"
                  src={`data:image/png;base64,${new Identicon(
                    account,
                    30
                  ).toString()}`}
                />
              ) : (
                <span></span>
              )}
            </small>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
