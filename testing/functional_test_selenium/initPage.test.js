// import selenium functions
const {
  Builder, By, Key, until,
} = require('selenium-webdriver');

// this example will run the test on Firefox
// install and import chromedriver for Chrome
require('geckodriver');

// declare the -web- driver
let driver;

beforeAll(async () => {
  // initialize the driver before running the tests
  driver = await new Builder().forBrowser('firefox').build();
});

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
});

// use the driver to mock user's actions
async function mockUserAction() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:8000/index.html'));
  await driver.get('http://localhost:8000/index.html');
  // locate the textbox, provide a timeout
  const textbox = await driver.wait(until.elementLocated(By.id('city')), 10000);
  // enter text in the textbox
  await textbox.sendKeys('Douala', Key.RETURN);
  // click on 'get weather' button
  await driver.findElement(By.id('btn1')).click();
  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('data')), 10000);
}

it('test webpage updated correctly', async () => {
  // call the mock function
  const element = await mockUserAction();
  // retrieve the content of the element
  const returnedText = await element.getText();
  // test the values
  expect(element).not.toBeNull();
  expect(returnedText).toEqual('City: Douala * Temp: 88.7');
});
