import { useEffect, useState } from "react";
import { getCurrentCryptoData, getCurrentFxData } from "../api/alphavantage";

export function useAlphavantage() {
  const [ethRate, setEthRate] = useState(0);
  const [btcRate, setBtcRate] = useState(0);
  const [usdGbpRate, setUsdGbpRate] = useState(0);

  async function getCryptoData(coin) {
    const cryptoData = await getCurrentCryptoData({
      fromSymbol: coin,
      toSymbol: "USD",
    });

    return +cryptoData.value?.["5. Exchange Rate"];
  }

  async function getFxData(currency) {
    const cryptoData = await getCurrentCryptoData({
      fromSymbol: "USD",
      toSymbol: currency,
    });

    return +cryptoData.value?.["5. Exchange Rate"];
  }

  /* Coin rate in USD */
  const getCoinRate = (coinType) => {
    if (coinType === "eth") {
      return ethRate;
    }
    if (coinType === "btc") {
      return btcRate;
    }

    throw new Error("Unsupported coin type!");
  };

  async function loadAllCryptoRates() {
    const ethData = await getCryptoData("ETH");
    const btcData = await getCryptoData("BTC");
    const fxData = await getFxData("GBP");

    setBtcRate(+btcData);
    setEthRate(+ethData);
    setUsdGbpRate(+fxData);
  }

  useEffect(() => {
    loadAllCryptoRates();
  }, []);

  return { getCryptoData, ethRate, btcRate, usdGbpRate, getCoinRate };
}
