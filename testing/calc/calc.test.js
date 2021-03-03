/* eslint-disable no-undef */
const calc = require('./calc');

test('addition 1 + 2 to equal 3', () => {
  expect(calc.sum(4, 2)).toBe(6);
});

test('multiplication 2 * 3 to equal 6', () => {
  expect(calc.mult(2, 3)).toBe(6);
});

test('division 6 / 3 to equal 2', () => {
  expect(calc.div(6, 3)).toBe(2);
});

describe('testing exceptions', () => {
  test('exception throws', () => {
    expect(() => calc.div(6, 0)).toThrow();
  });

  test('exception try', () => {
    let err;
    expect(err).toBe(undefined);
    try {
      calc.div(6, 0);
    } catch (e) {
      err = e;
    }
    expect(err).not.toBe(undefined);
  });
});
