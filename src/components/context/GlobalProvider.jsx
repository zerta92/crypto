import React, { useReducer, useContext, createContext, useEffect } from "react";
import { cacheData, getCachedData } from "../utils";
import { getCurrentCryptoData } from "../api/alphavantage";

const GlobalStateContext = createContext(null);
const GlobalDispatchContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "setCurrency":
      return {
        ...state,
        currency: action.payload,
        symbol: getCurrencySymbol(action.payload),
      };
    case "setRate":
      return {
        ...state,
        rate: +action.payload,
      };
    case "setAccountId":
      return {
        ...state,
        account: action.payload,
      };
    default:
      throw new Error(`Unknown action?`);
  }
};

const getCurrencyUSDRate = async (currency) => {
  const cryptoData = await getCurrentCryptoData({
    fromSymbol: "USD",
    toSymbol: currency,
  });

  if (currency === "GBP") {
    return cryptoData?.value?.["5. Exchange Rate"];
  }
  return 1;
};

const getCurrencySymbol = (currency) => {
  if (currency === "GBP") {
    return "£";
  }
  return "$";
};

export const GlobalProvider = ({ children, account }) => {
  const locale = getCachedData(`_crypto_log_locale`) ?? "GBP";
  const usdGbpRate =
    getCachedData(`_FromSymbol_USD_ToSymbol_${locale}`)?.value?.[
      "5. Exchange Rate"
    ] ?? 1;

  const initialState = { account };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "setAccountId", payload: account });
    dispatch({ type: "setCurrency", payload: locale });
    dispatch({ type: "setRate", payload: usdGbpRate });
  }, [locale, account]);

  return (
    <GlobalDispatchContext.Provider value={dispatch}>
      <GlobalStateContext.Provider value={state}>
        {children}
      </GlobalStateContext.Provider>
    </GlobalDispatchContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalStateContext);
export const useDispatchGlobal = () => useContext(GlobalDispatchContext);
