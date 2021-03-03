// version 1

const createPage = function (user) {
  const div = document.createElement('div');
  div.setAttribute('id', 'usr');
  div.innerHTML = `${user.name}:${user.major}`;
  document.body.appendChild(div);
};

// version 2, the js code does not add elements to the DOM
/* const createPage = function (user) {
  const div = document.getElementById('usr');
  div.innerHTML = `${user.name}:${user.major}`;
}; */

module.exports = { createPage };
