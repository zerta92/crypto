import React, { useState } from "react";
import Papa from "papaparse";
import { useTransactions } from "../hooks/useTransactions.jsx";
import { toSmallestUnit } from "../utils.js";

const allowedExtensions = ["csv"];

const CsvReader = ({ account, cryptoTransactions }) => {
  const [data, setData] = useState([]);
  const { createTransactions } = useTransactions(account, cryptoTransactions);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    setError("");

    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile(inputFile);
    }
  };

  const handleParse = () => {
    if (!file) return alert("Enter a valid file");

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
      });
      const parsedData = csv?.data;
      const formattedData = parsedData.map((data) => {
        return {
          type: data?.Asset,
          amount: toSmallestUnit(data?.Asset, data?.Amount),
          transactionDate: new Date(data?.Date).getTime(), //MM-DD-YYYY
          rate: parseFloat(data?.Rate),
        };
      });

      await createTransactions(formattedData);

      setData(formattedData);
    };
    reader.readAsText(file);
  };

  const styles = {
    container: {
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      margin: "auto",
    },
    title: {
      fontSize: "1.5rem",
      color: "#333",
      textAlign: "center",
      marginBottom: "1rem",
    },
    label: {
      fontSize: "1rem",
      color: "#555",
      display: "block",
      marginBottom: "0.5rem",
    },
    input: {
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      marginBottom: "1rem",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      width: "100%",
      maxWidth: "200px",
      margin: "0 auto",
      display: "block",
    },

    buttonHover: {
      backgroundColor: "#0056b3",
    },
    dataContainer: {
      marginTop: "1.5rem",
      fontSize: "0.95rem",
      color: "#333",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    },
    item: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    [`csv-reader__container`]: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
  };

  return (
    <div style={styles.container}>
      <label htmlFor="csvInput" style={styles.label}>
        Select a CSV File:
      </label>
      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="file"
        style={styles.input}
      />
      <button
        style={styles.button}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = styles.button.backgroundColor)
        }
        onClick={handleParse}
      >
        Import CSV
      </button>
      <div style={styles.dataContainer}>
        {error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          data.map((e, i) => (
            <div key={i} style={styles.item}>
              {e[0]}: {e[1]}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CsvReader;
