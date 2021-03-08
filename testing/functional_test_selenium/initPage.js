/*
In this example, we are loading data from a JSON file and update the DOM
 */

// fetch data and store it inside a map
const weatherData = async () => {
  const res = await fetch('http://localhost:8000/data.json');
  const resjson = await res.json();

  // store the data inside a map
  const dataMap = new Map();
  Object.entries(resjson).forEach((e) => {
    dataMap.set(e[1].name, e[1].temp);
  });
  return dataMap;
};

const getWeather = async (city = document.getElementById('city').value) => {
  try {
    const wdata = await weatherData();
    const entry = { name: city, temp: wdata.get(city) };
    return Promise.resolve(entry);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const displayData = async () => {
  const val = await getWeather();
  document.getElementById('data').innerHTML = `City: ${val.name} * Temp: ${val.temp}`;
};

export const initWPage = () => {
  const lbl = document.createElement('label');
  lbl.setAttribute('for', 'city');
  lbl.innerHTML = 'City';
  document.body.appendChild(lbl);

  const inpt = document.createElement('input');
  inpt.setAttribute('type', 'text');
  inpt.setAttribute('id', 'city');
  inpt.setAttribute('value', '');
  document.body.appendChild(inpt);

  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('id', 'btn1');
  btn.innerHTML = 'Get Weather';
  document.body.appendChild(btn);

  document.body.appendChild(document.createElement('br'));

  const div = document.createElement('div');
  div.setAttribute('id', 'data');
  div.innerHTML = 'City:_____  * Temp:______';
  document.body.appendChild(div);
};

export const addEventsHandlers = () => {
  const btn = document.getElementById('btn1');
  btn.addEventListener('click', displayData);
};
