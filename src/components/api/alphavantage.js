import { cacheData, getCachedData } from "../utils";
const API_KEY = "R6ZSU4QDSJ052XQN";

//cache data and reset cache every 6 hours
export async function getDailyCryptoData({ fromSymbol, toSymbol }) {
  console.log("here 2");

  return;
  //https://www.alphavantage.co/query?function=${asset}&symbol=${fromSymbol}&market=${toSymbol}&outputsize=full&apikey=${API_KEY}
  //https://www.alphavantage.co/query?function=${asset}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}&interval=${interval}&outputsize=full&apikey=${API_KEY}
  // https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={}&to_currency={}&apikey={}
  const response = await fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${fromSymbol}&market=${toSymbol}&apikey=${API_KEY}`,
    {
      method: "GET",
    }
  );

  const intradayData = await response.json();

  return intradayData;
}

export async function getCurrentCryptoData({ fromSymbol, toSymbol }) {
  const cached = await getCachedData(
    `_FromSymbol_${fromSymbol}_ToSymbol_${toSymbol}`
  );

  /* Ignore cache if 6 hours stale */
  if (
    cached &&
    cached.value &&
    new Date().getTime() - new Date(cached.date).getTime() < 2.16e7
  ) {
    console.log(
      `got cached data for _FromSymbol_${fromSymbol}_ToSymbol_${toSymbol} `
    );

    return cached;
  }

  const response = await fetch(
    `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromSymbol}&to_currency=${toSymbol}&apikey=${API_KEY}`,
    {
      method: "GET",
    }
  );

  const currentData = await response.json();

  const currentDataValue = currentData["Realtime Currency Exchange Rate"];

  if (!currentDataValue) {
    throw new Error(currentData?.Information);
  }

  const valueAndDate = { value: currentDataValue, date: new Date() };

  cacheData(`_FromSymbol_${fromSymbol}_ToSymbol_${toSymbol}`, valueAndDate);

  return valueAndDate;
}
