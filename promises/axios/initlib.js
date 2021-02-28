// JSON response -- temperature
const location = 'http://api.openweathermap.org/data/2.5/weather?q=Houston,usa&appid=ad197b2a2b21e5c149be54d637d642ca&units=imperial';

// Text response
axios.get(location).then((response) => response.data).then((wdata) => {
  document.getElementById('loc').innerHTML = `${wdata.name} : ${wdata.main.temp}`;
}).catch((err) => alert(`Error: ${err}`));

// Blob response -- image
const imgLoc = 'https://dog.ceo/api/breeds/image/random';

const getImgURL = async () => axios.get(imgLoc).then( // no need to add async since we are returning
  (imgResponse) => imgResponse.data.message,
);

// async/await
async function fetchImage() {
  try {
    const imgURL = await getImgURL();
    const response = await axios.get(imgURL, { responseType: 'blob' });
    // .then((imgdata) => {
    const localURL = URL.createObjectURL(response.data);
    const image = document.createElement('img');
    image.src = localURL;
    image.style.border = '200px';
    image.style.width = '500px';
    image.style.height = '500px';
    document.body.appendChild(image);
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

fetchImage();
