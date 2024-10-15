import React from "react";
import Identicon from "identicon.js";
import { useGlobal, useDispatchGlobal } from "./context/GlobalProvider.jsx";
import { useAlphavantage } from "./hooks/useAlphavantage";
import { cacheData } from "./utils.js";

function Navbar({ handleModalOpen }) {
  const { currency, symbol, rate, account } = useGlobal();
  const { ethRate, btcRate } = useAlphavantage();
  const dispatchGlobal = useDispatchGlobal();

  const toggleCurrency = (currency) => {
    if (currency === "GBP") {
      cacheData(`_crypto_log_locale`, "USD");
      return "USD";
    }
    cacheData(`_crypto_log_locale`, "GBP");
    return "GBP";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark p-0 shadow">
      <div className="container-fluid">
        <a
          className="navbar-brand"
          href="/"
          target="_self"
          rel="noopener noreferrer"
        >
          Summary
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/transactions" target="_self">
                Transactions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/posts" target="_self">
                Notes
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  handleModalOpen();
                }}
              >
                Log
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/"
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
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item mr-3">
              <span className="navbar-text">
                ETH: {symbol}
                {(ethRate * rate).toFixed(2)}
              </span>
            </li>
            <li className="nav-item mr-3">
              <span className="navbar-text">
                BTC: {symbol}
                {(btcRate * rate).toFixed(2)}
              </span>
            </li>
            <li className="nav-item text-nowrap">
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
      </div>
    </nav>
  );
}

export default Navbar;
