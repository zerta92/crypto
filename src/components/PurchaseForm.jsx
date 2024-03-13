import React, { useRef } from "react";

const PurchaseForm = ({ createTransaction }) => {
  const datePickerRef = useRef(null);
  const selectedCryptoRef = useRef(null);
  const amountRef = useRef(null);
  const purchaseRatetRef = useRef(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const type = selectedCryptoRef.current.value;
        const amountRaw = amountRef.current.value;
        const amount =
          type === "btc"
            ? amountRaw * 1e8
            : window.web3.utils.toWei(amountRaw, "Ether");

        const dateValue = new Date(datePickerRef.current.value);
        const rate = purchaseRatetRef.current.value;

        createTransaction({
          type,
          amount,
          transactionDate: dateValue.getTime(),
          rate,
        });
      }}
    >
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
          ref={selectedCryptoRef}
        >
          <option value="eth">Ethereum</option>
          <option value="btc">Bitcoin</option>
          <option value="dot">Polkadot</option>
        </select>
      </div>

      {/* <div className="mb-3">
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
      </div> */}

      <div className="mb-3">
        <label htmlFor="cryptoAmountValue" className="form-label">
          Enter Crypto Amount
        </label>
        <input
          type="text"
          className="form-control"
          id="cryptoAmountValue"
          placeholder="Enter value"
          pattern="[0-9]*\.?[0-9]+"
          ref={amountRef}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cryptoAmountValue" className="form-label">
          Enter Purchase Rate
        </label>
        <input
          type="number"
          className="form-control"
          id="cryptoAmountValue"
          placeholder="Enter value"
          ref={purchaseRatetRef}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="datePicker" className="form-label">
          Select Purchase Date
        </label>
        <input
          type="date"
          className="form-control"
          id="datePicker"
          ref={datePickerRef}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Purchase
      </button>
    </form>
  );
};

export default PurchaseForm;
