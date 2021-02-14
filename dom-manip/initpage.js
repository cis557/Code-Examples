// eslint-disable-next-line no-unused-vars
function initialize() {
  // add CSS code
  const stl = document.createElement('style');
  stl.innerHTML = 'div::first-letter { color: red; font-size: xx-large;} button:hover {background-color: blue}';
  document.head.appendChild(stl);

  // create label
  const lbl = document.createElement('label');
  lbl.setAttribute('for', 'city');
  lbl.innerHTML = 'City';
  document.body.appendChild(lbl);

  // create input textbox
  const inpt = document.createElement('input');
  inpt.setAttribute('type', 'text');
  inpt.setAttribute('id', 'city');
  inpt.setAttribute('value', 'Philadelphia');
  document.body.appendChild(inpt);

  // create button
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('id', 'btn1');
  btn.innerHTML = 'Get Weather';
  document.body.appendChild(btn);

  document.body.appendChild(document.createElement('br'));

  // create  div
  const div = document.createElement('div');
  div.setAttribute('id', 'dat');
  div.innerHTML = 'City:_____  * Temp:______';
  document.body.appendChild(div);
}
