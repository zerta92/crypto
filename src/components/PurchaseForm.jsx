import React, { useEffect, useRef, useState } from "react";
import { useGlobal } from "./context/GlobalProvider.jsx";
import { convertToUsd, toSmallestUnit } from "./utils.js";
import { useAlphavantage } from "./hooks/useAlphavantage.jsx";
import { useTransactionContext } from "./context/TransactionContext.tsx";
const PurchaseForm = ({ handleModalClose }) => {
  const { currency, rate, symbol } = useGlobal();
  const { createTransactions, error, errorMessage } = useTransactionContext();
  const { getCoinRate, ethRate } = useAlphavantage();
  const datePickerRef = useRef(null);

  const selectedCryptoRef = useRef(null);
  const amountRef = useRef(null);
  const purchaseRatetRef = useRef(null);
  const [purchaseRate, setPurchaseRate] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setPurchaseRate(getCoinRate("eth") * rate);
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, [rate, ethRate]);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const type = selectedCryptoRef.current.value;
        const amountRaw = amountRef.current.value;
        const amount = toSmallestUnit(type, amountRaw);

        const dateValue = new Date(selectedDate);

        const usedRateUSD = convertToUsd(purchaseRate, rate);

        await createTransactions([
          {
            type,
            amount,
            transactionDate: dateValue.getTime(),
            rate: usedRateUSD,
          },
        ]);

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
          value={selectedDate}
          required
          onChange={(e) => {
            setSelectedDate(e.target.value);
          }}
        />
      </div>
      {error && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button type="submit" className="btn btn-primary">
        Log Transaction
      </button>
    </form>
  );
};

export default PurchaseForm;
