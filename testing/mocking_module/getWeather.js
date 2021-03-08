const lib = require('./jsmodule.js');

// Fetch the data online and update the webpage
const updateWeather = async () => {
  const data = await lib.fetchWeather();
  document.getElementById('loc').innerHTML = `${data.name} : ${data.main.temp}`;
};

module.exports = { updateWeather };
