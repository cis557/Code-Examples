// import path
const path = require('path');

// import fs
const fs = require('fs').promises;

// import express
const express = require('express');

// import formidable
const formidable = require('formidable');

// enable cross-origin resource sharing (cors)
const cors = require('cors');

// Create express app
const webapp = express();

webapp.use(cors());

// Import database operations
const lib = require('./dbOperationsMySQL');

// import images operations
const img = require('./imgOperations');

// Server port
const port = 8080;

webapp.use(express.urlencoded({
  extended: true,
}));

// declare DB object

let db;

// Start server and connect to the DB
webapp.listen(port, async () => {
  db = await lib.connect();
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to our images web app' });
});

// upload endpoint with formidable
webapp.post('/upload/', async (req, res) => {
  console.log('upload a file');
  const form = formidable.IncomingForm();
  // configure upload folder
  const uploadFolder = path.join(__dirname, 'files');
  form.multiples = true;
  form.maxFileSize = 20 * 1024 * 1024; // 2MB
  form.uploadDir = uploadFolder;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }

    // we add each file to the DB
    Object.keys(files).forEach(async (key) => {
      const value = files[key];
      try {
        const data = await img.convertToBase64String(value.path);
        const newName = `${Date.now()}.${value.path.split('.').pop()}`;
        await lib.addImage(db, { name: `${newName}`, image: data });
      } catch (error) {
        console.log(error.message);
      }
    });

    res.status(201).json({ message: 'files uploaded' });
  });
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
