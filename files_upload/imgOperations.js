/* eslint-disable no-console */
// import fs
const fs = require('fs').promises;

const convertToBase64String = async (imgFile) => {
  try {
    const bitmap = await fs.readFile(imgFile);
    return Buffer.from(bitmap).toString('base64');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { convertToBase64String };
