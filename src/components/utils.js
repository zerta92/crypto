import { cache } from "react";

export const formatDate = (utcDate) => {
  const day = new Date(utcDate).getDate();

  const month = new Date(utcDate).getMonth();

  const year = new Date(utcDate).getFullYear();
  return `${day}/${month}/${year}`;
};

export const cacheData = (cacheName, response) => {
  localStorage.setItem(cacheName, JSON.stringify(response));
  // const data = new Response(JSON.stringify(response));
  // if ("caches" in window) {
  //   caches.open(cacheName).then((cache) => {
  //     cache.put(url, data);
  //   });
  // }
};

export const getCachedData = (cacheName) => {
  // if ("caches" in window) {
  const cache = localStorage.getItem(cacheName);

  if (!cache) {
    return;
  }

  return JSON.parse(cache);
  //   caches.open(cacheName).then((cache) => {
  //     console.log(cache);
  //   });
  // }
};
