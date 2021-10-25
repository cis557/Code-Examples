// import fetch
const axios = require('axios');
// JSON response -- temperature
const location = 'http://api.openweathermap.org/data/2.5/weather?q=Philadelphia,usa&appid=ad197b2a2b21e5c149be54d637d642ca';

async function fetchWeather() {
  const response = await axios.get(location);
  return response.data;
}

module.exports = { fetchWeather };
