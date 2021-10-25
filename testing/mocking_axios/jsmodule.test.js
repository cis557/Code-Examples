const lib = require('./jsmodule.js');
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const mockAxios = new MockAdapter(axios);

describe('the api returned correct data for philadelphia', () => {
  // seed data for all get requests. You can specify an endpoint to mock
  mockAxios.onGet().reply(200, {
     name: 'Philadelphia', main: { temp: 70 } ,
  });
  test('the city is Philadelphia (then/catch)', () => lib.fetchWeather().then((data) =>
    expect(data.name).toBe('Philadelphia')));
  
  test('the city is Philadelphia (async/await)', async () => {
    const data = await lib.fetchWeather();
    expect(data.name).toBe('Philadelphia');
  });
  test('the temperature is correct', () => lib.fetchWeather().then((data) => expect(data.main.temp).toBe(70)));
});
