// eslint-disable-next-line import/prefer-default-export
export const getWeather = async (city) => {
  const location = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d01dbe80c384ea20a6937f2aa98848d`;
  const res = await fetch(location);
  const res1 = res.json();
  return res1;
};
