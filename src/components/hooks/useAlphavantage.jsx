import { useEffect, useState } from "react";
import { getCurrentCryptoData } from "../api/alphavantage";

export function useAlphavantage() {
  const [ethRate, setEthRate] = useState(0);
  const [btcRate, setBtcRate] = useState(0);

  async function getCryptoData(coin) {
    const cryptoData = await getCurrentCryptoData({
      fromSymbol: coin,
      toSymbol: "USD",
    });

    return +cryptoData.value?.["5. Exchange Rate"];
  }

  async function loadAllCryptoRates() {
    const ethData = await getCryptoData("ETH");
    const btcData = await getCryptoData("BTC");
    setBtcRate(+btcData);
    setEthRate(+ethData);
  }

  useEffect(() => {
    loadAllCryptoRates();
  }, []);

  return { getCryptoData, ethRate, btcRate };
}
