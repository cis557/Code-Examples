// JSON response -- temperature
const location = 'http://api.openweathermap.org/data/2.5/weather?q=Houston,usa&appid=ad197b2a2b21e5c149be54d637d642ca&units=imperial';

// Text response
fetch(location).then((response) => response.json()).then((wdata) => {
  document.getElementById('loc').innerHTML = `${wdata.name} : ${wdata.main.temp}`;
}).catch((err) => alert(`Error: ${err}`));

// Blob response -- image
const imgLoc = 'https://dog.ceo/api/breeds/image/random';

const getImgURL = async () => {
  const imgResponse = await (await fetch(imgLoc)).json();
  return imgResponse.message;
};

// async/await
async function fetchImage() {
  try {
    const imgURL = await getImgURL();
    // using a request
    const req = new Request(imgURL);
    console.log('Request method:', req.method);
    const img = await (await fetch(req)).blob();
    const localURL = URL.createObjectURL(img);
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
