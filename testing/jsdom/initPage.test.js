/* eslint-disable no-undef */
const lib = require('./initPage.js');

/**
// Update the DOM in your test
// if not done by the JS code (version 2)

 const div = document.createElement('div');
 div.setAttribute('id', 'usr');
 document.body.appendChild(div);
*/
lib.createPage({ name: 'Malik', major: 'CIS' });
test('test info was added to web page', () => {
  const element = document.getElementById('usr');
  expect(element).not.toBeNull();
  expect(element.innerHTML).toEqual('Malik:CIS');
});
