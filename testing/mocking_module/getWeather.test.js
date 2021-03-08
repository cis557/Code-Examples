/*
  In the previous example we need to know what will be returned by the API
  before tunning the test. Which makes our test fragile and unreliable
  To improve the robustness of the test we need to "mock" calls to
  external modules.
  We will mock an entire module in this example.
 */

// We are mocking jsmodule.js 
jest.mock('./jsmodule.js');

// You will use lib1 when implementing the lecture activity
const lib1 = require('./getWeather.js');
const lib2 = require('./jsmodule.js');

// We mock the fetchWeather function
// The promise returned by  fetchWeather() will always resolve to the value passed as parameter
lib2.fetchWeather.mockResolvedValue({ name: 'Philadelphia', main: { temp: 70 } });

describe('fetch and DOM testing with mocking', () => {
  test('the temperature is correct with mocking', async () => {
    const data = await lib2.fetchWeather();
    expect(data.main.temp).toBe(70);
  });

  test('weather data is displayed on the web page', () => {
    // lecture activity
  });
});
