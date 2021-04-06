import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { getWeather } from './getData';

function WeatherApp() {
  const cities = ['Philadelphia', 'Boston', 'Mumbai', 'Dakar', 'Shanghai', 'London'];
  const [city, setCity] = useState('');

  useEffect(() => {
    // Bookmarks and shared links
    // Use the URL to restore the app state
    const url = window.location.href;
    if (url.split('/').length === 4) {
      setCity(url.split('/').pop());
    }
    if (city !== '') {
      getWeather(city).then((response) => {
        const pCity = document.getElementById('city');
        pCity.innerHTML = `City: ${city}`;
        const pDesc = document.getElementById('desc');
        pDesc.innerHTML = `Weather: ${response.weather[0].description}`;
        const pTemp = document.getElementById('temp');
        pTemp.innerHTML = `Temp: ${response.main.temp}`;
      });
    }
  }, [city]);

  const updateCity = (loc) => {
    if (loc) {
      // update city triggered by a click on a link
      const clicked = String(loc.target).split('/').pop();
      setCity(clicked);
    } else { // homepage + button
      // Lecture Activity: update city triggered by a button click (search box)
      // Update the URL in the address bar to be /{the_city}
    }
  };

  return (
    <Router>
      <div>
        <header>
          <input type="text" id="inpt" />
          <button type="button" id="btn" onClick={() => updateCity()}>OK</button>
        </header>
        <section>
          <h1>Cities</h1>
          <nav>
            <ul>
              {cities.map((loc) => (
                <li key={loc}><Link to={`/${loc}`} onClick={(anchor) => updateCity(anchor)}>{loc}</Link></li>
              ))}
            </ul>
          </nav>

          <article>
            <Route path="/:loc" render={() => (<WeatherBox />)} />
          </article>
        </section>
      </div>
    </Router>
  );
}

const WeatherBox = () => (
  <div>
    <ul>
      <li id="city">
        {' '}
        City:
      </li>
      <li id="temp">
        {' '}
        Temp:
      </li>
      <li id="desc">
        {' '}
        Current Weather:
      </li>
    </ul>
  </div>
);

export default WeatherApp;
