const fs = require('fs');

const fStream = fs.createWriteStream('textwrite.txt');

fStream.on('finish', () =>
 console.log('file has been written!'));

fStream.write('Hello CIS557\n');
fStream.write('Bye bye\n');
fStream.end();
