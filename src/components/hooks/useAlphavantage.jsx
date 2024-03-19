import { useEffect } from "react";
import { getCurrentCryptoData } from "../api/alphavantage";

export function useAlphavantage() {
  async function getCryptoData(coin) {
    const cryptoData = await getCurrentCryptoData({
      fromSymbol: coin,
      toSymbol: "USD",
    });

    return +cryptoData.value?.["5. Exchange Rate"];
  }

  useEffect(() => {}, []);

  return { getCryptoData };
}
