import React from "react";
import Identicon from "identicon.js";
import { useGlobal, useDispatchGlobal } from "./context/GlobalProvider.jsx";

function Navbar({ account, handleModalOpen }) {
  const { currency } = useGlobal();
  const dispatchGlobal = useDispatchGlobal();

  const toggleCurrency = (currency) => {
    if (currency === "GBP") {
      return "USD";
    }
    return "GBP";
  };

  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="/"
        target="_self"
        rel="noopener noreferrer"
      >
        Summary
      </a>

      <a
        className="nav-item col-sm-3 col-md-2 mr-0"
        href="/transactions"
        target="_self"
        rel="noopener noreferrer"
      >
        Transactions
      </a>
      <a
        className="nav-item col-sm-3 col-md-2 mr-0"
        href="/posts"
        target="_self"
        rel="noopener noreferrer"
      >
        Posts
      </a>

      <a
        href="/"
        target="_self"
        className="nav-item col-sm-3 col-md-2 mr-0"
        onClick={(event) => {
          event.preventDefault();
          handleModalOpen();
        }}
      >
        Purchase Crypto
      </a>
      <a
        className="nav-item col-sm-3 col-md-2 mr-0"
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
      <ul className="navbar-nav px-3 d-flex flex-row">
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
    </nav>
  );
}

export default Navbar;
