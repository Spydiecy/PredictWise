import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

const CACHE_KEY = 'tezos_price_cache';
const CACHE_DURATION = 30000;

export const getTezosPrice = async () => {
  const now = Date.now();
  const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');

  if (cachedData.price && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.price;
  }

  try {
    const response = await api.get('/simple/price?ids=tezos&vs_currencies=usd');
    const price = response.data.tezos.usd;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ price, timestamp: now }));
    return price;
  } catch (error) {
    console.error('Error fetching Tezos price:', error);
    return cachedData.price || null; // Return last cached price if available, otherwise null
  }
};

export default api;