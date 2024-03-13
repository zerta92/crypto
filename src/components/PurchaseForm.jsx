import React from "react";
import CryptoTransactions from "../abis/CryptoTransactions.json";

const PurchaseForm = () => {
  return (
    <form>
      <div className="mb-3">
        <label htmlFor="cryptoSelect" className="form-label">
          Select Cryptocurrency
        </label>
        <select
          className="form-select"
          id="cryptoSelect"
          style={{
            display: "block",
          }}
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="polkadot">Polkadot</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="currencySelect" className="form-label">
          Select Fiat Currency
        </label>
        <select
          className="form-select"
          id="currencySelect"
          style={{
            display: "block",
          }}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="currencyValue" className="form-label">
          Enter Current Currency Value
        </label>
        <input
          type="number"
          className="form-control"
          id="currencyValue"
          placeholder="Enter value"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="datePicker" className="form-label">
          Select Date
        </label>
        <input type="date" className="form-control" id="datePicker" />
      </div>

      <button type="submit" className="btn btn-primary">
        Purchase
      </button>
    </form>
  );
};

export default PurchaseForm;
