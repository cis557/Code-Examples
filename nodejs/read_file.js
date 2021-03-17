const fs = require('fs');

const fStream = fs.createReadStream('text.txt');

// Read stream
/*
fStream.on('readable', () => {
  console.log(`File content: ${fStream.read()}`);
});
*/

fStream.on('data', (chunk) => {
  console.log('Read: ', chunk.length, 'bytes', chunk.toString('utf8'));
});


fStream.on('end', () => {
  console.log('end');
});

fStream.on('error', (err) => {
  console.error('Raised error', err);
});


/*
// callback version
function readAFile() {
  fs.readFile('text.txt', (err, data) => {
    if (err) throw err;
    console.log(`Callback: ${data}`);
  });
}

// readfile
// promise version
function readAFilePromise() {
  return new Promise((resolve, reject) => {
    fs.readFile('text.txt', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

readAFile();
readAFilePromise().then((x) => console.log(`Promise: ${x}`));
*/
