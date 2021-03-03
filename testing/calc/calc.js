function sum(a, b) {
  return a + b;
}

function mult(a, b) {
  return a * b;
}

function div(a, b) {
  if (b === 0) {
    throw new Error('b is zero');
  }
  return a / b;
}
module.exports = { sum, mult, div };
