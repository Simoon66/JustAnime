const cleanUrl = (url) => url?.trim().replace(/\/+$/, "");

const getCsvUrls = (value) =>
  value
    ?.split(",")
    .map(cleanUrl)
    .filter(Boolean) || [];

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

export const API_BASE_URL = cleanUrl(import.meta.env.VITE_API_URL) || "/api";
export const WORKER_URLS = getCsvUrls(import.meta.env.VITE_WORKER_URL);
export const M3U8_PROXY_URLS = getCsvUrls(import.meta.env.VITE_M3U8_PROXY_URL);
export const HD_1_PROXY_URL = import.meta.env.VITE_HD_1_PROXY_URL?.trim();

export const getApiBaseUrl = () => API_BASE_URL;

export const getRandomApiBaseUrl = () =>
  WORKER_URLS.length ? pickRandom(WORKER_URLS) : API_BASE_URL;

export const getM3u8ProxyUrl = (serverName) => {
  if (serverName === "HD-1" && HD_1_PROXY_URL) return HD_1_PROXY_URL;
  return M3U8_PROXY_URLS.length ? pickRandom(M3U8_PROXY_URLS) : "";
};
