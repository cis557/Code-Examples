import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { getWeather } from './getData';

function WeatherApp() {
  const cities = ['Philadelphia', 'Boston', 'Mumbai', 'Dakar', 'Shanghai', 'London'];
  const [city, setCity] = useState('');
  // will store the city typed in the texbox
  let inputCity ='';

  useEffect(() => {
    // Bookmarks and shared links
    // Use the URL to restore the app state
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/location
    const url = window.location.href;
    let urlCity = '';
    if (url.split('/').length === 4) {
      urlCity = url.split('/').pop();
    }
    // will store the city from the url or the state
    let location = city; 
    if (urlCity !== '' && city === '') {
      location = urlCity;
    }
    if (location !== '') { // Fetches data from the openweathermap API and updates the DOM
      getWeather(location).then((response) => {
        const pCity = document.getElementById('city');
        pCity.innerHTML = `City: ${location}`;
        const pDesc = document.getElementById('desc');
        pDesc.innerHTML = `Weather: ${response.weather[0].description}`;
        const pTemp = document.getElementById('temp');
        pTemp.innerHTML = `Temp: ${response.main.temp}`;
      });
    }
  }, [city]);

  const handleOnChange = (e) => {
    inputCity = e.target.value;
  };

  const handleOnClick = (e) => {
    // update the state to trigger rerendering
    setCity(inputCity); 
    // update the url - https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    window.history.pushState('string', {inputCity}, `/${inputCity}`);
  };
  const updateCity = (loc) => {
      // update city triggered by a click on a link
      const clickedCity = String(loc.target).split('/').pop();
      // clear the input box (just in case)
      document.getElementById('inpt').value = '';
      setCity(clickedCity);
  };

  return (
    <Router>
      <div>
        <header>
          <input type="text" id="inpt" onChange={(e) => handleOnChange(e)} />
          <button type="button" id="btn" onClick={() => handleOnClick()}>OK</button>
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
