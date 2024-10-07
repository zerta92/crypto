export const formatDate = (utcDate) => {
  const day = new Date(utcDate).getDate();

  const month = new Date(utcDate).getMonth();

  const year = new Date(utcDate).getFullYear();
  return `${day}/${month}/${year}`;
};

export const cacheData = (cacheName, response) => {
  localStorage.setItem(cacheName, JSON.stringify(response));
};

export const getCachedData = (cacheName) => {
  const cache = localStorage.getItem(cacheName);

  if (!cache) {
    return;
  }

  return JSON.parse(cache);
};

export const fromSmallestUnit = (coinType, amount) => {
  if (coinType === "eth") {
    return window.web3.utils.fromWei(amount.toString(), "Ether");
  }
  if (coinType === "btc") {
    return amount / 1e8;
  }
  throw new Error("Unsupported coin type!");
};

export const toSmallestUnit = (coinType, amount) => {
  if (coinType === "eth") {
    return window.web3.utils.toWei(amount, "Ether");
  }
  if (coinType === "btc") {
    return amount * 1e8;
  }
  throw new Error("Unsupported coin type!");
};
