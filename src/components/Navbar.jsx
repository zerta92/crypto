import React, { Component } from "react";
import Identicon from "identicon.js";
import PurchaseForm from "./PurchaseForm";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_self"
          rel="noopener noreferrer"
        >
          Zerta's Log
        </a>

        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_self"
          onClick={(event) => {
            event.preventDefault();
            this.props.handleModalOpen();
          }}
        >
          Purchase Crypto
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
              {this.props.account ? (
                <img
                  alt=""
                  className="ml-2"
                  height="30"
                  width="30"
                  src={`data:image/png;base64,${new Identicon(
                    this.props.account,
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
}

export default Navbar;
