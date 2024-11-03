import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd',
  timeout: 60000,
  headers: {'X-Custom-Header': 'foobar'}
});

export default instance;