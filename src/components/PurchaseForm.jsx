import React, { useEffect, useRef, useState } from "react";
import { useTransactions } from "./hooks/useTransactions";
import { useGlobal } from "./context/GlobalProvider.jsx";
import { convertToUsd, toSmallestUnit } from "./utils.js";
import { useAlphavantage } from "./hooks/useAlphavantage.jsx";
const PurchaseForm = ({ account, cryptoTransactions, handleModalClose }) => {
  const { currency, rate, symbol } = useGlobal();
  const { createTransaction } = useTransactions(account, cryptoTransactions);
  const { getCoinRate, ethRate } = useAlphavantage();
  const datePickerRef = useRef(null);

  const selectedCryptoRef = useRef(null);
  const amountRef = useRef(null);
  const purchaseRatetRef = useRef(null);
  const [purchaseRate, setPurchaseRate] = useState(0);

  useEffect(() => {
    setPurchaseRate(getCoinRate("eth") * rate);
  }, [rate, ethRate]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const type = selectedCryptoRef.current.value;
        const amountRaw = amountRef.current.value;
        const amount = toSmallestUnit(type, amountRaw);

        const dateValue = new Date(datePickerRef.current.value);

        const usedRateUSD = convertToUsd(purchaseRate, rate);

        await createTransaction({
          type,
          amount,
          transactionDate: dateValue.getTime(),
          rate: usedRateUSD,
        });

        handleModalClose();
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
          onChange={(e) => {
            const coinRate = getCoinRate(e.target.value) * rate;
            setPurchaseRate(coinRate);
          }}
        >
          <option value="eth">Ethereum</option>
          <option value="btc">Bitcoin</option>
          <option value="dot">Polkadot</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="cryptoAmountValue" className="form-label">
          Enter Purchase Quantity
        </label>
        <div>
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
      </div>

      <div className="mb-3">
        <label htmlFor="cryptoAmountValue" className="form-label">
          Enter Purchase Rate
        </label>
        <div className="input-box">
          <span className="prefix">{symbol}</span>
          <input
            type="number"
            className="form-control"
            id="cryptoAmountValue"
            placeholder={`Enter value ${currency}`}
            ref={purchaseRatetRef}
            value={purchaseRate}
            onChange={(e) => setPurchaseRate(e.target.value)}
          />
        </div>
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
        Log Transaction
      </button>
    </form>
  );
};

export default PurchaseForm;
