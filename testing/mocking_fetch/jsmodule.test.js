/* eslint-disable no-undef */
const lib = require('./jsmodule.js');

describe('Fetch-mock: the api returned correct data for philadelphia', () => {
  fetch.mockResponse(JSON.stringify({ name: 'Philadelphia', main: { temp: 70 } }));
  test('the city is Philadelphia (then/catch)', () => lib.fetchWeather().then((data) => expect(data.name).toBe('Philadelphia')));
  
  test('the city is Philadelphia (async/await)', async () => {
    const data = await lib.fetchWeather();
    expect(data.name).toBe('Philadelphia');
  });
  test('the temperature is correct', () => lib.fetchWeather().then((data) => expect(data.main.temp).toBe(70)));
});
