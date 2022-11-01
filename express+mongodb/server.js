// Express app file

// (1) import express
// backend ==> require
const express = require('express');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

// (5) define the port
const port = 8080;

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));

// (7) import the db interactions module
const dbLib = require('./dbFunctions');

// (8) declare a db reference variable
let db;

// start the server and connect to the DB
webapp.listen(port, async () => {
  db = await dbLib.connect();
  console.log(`Server running on port: ${port}`);
});

// root endpoint / route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'welcome to our backend!!!' });
});

// implement the GET /students endpoint
webapp.get('/students', async (req, res) => {
  console.log('READ all students');
  try {
    // get the data from the db
    const results = await dbLib.getAllStudents(db);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the GET /student/:id endpoint
webapp.get('/student/:id', async (req, res) => {
  console.log('READ a students');
  try {
    // get the data from the db
    const results = await dbLib.getAStudent(db, req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the POST /student/ endpoint
webapp.post('/student/', async (req, res) => {
  console.log('CREATE a student');
  // parse the body of the request
  if (!req.body.name || !req.body.email || !req.body.major) {
    res.status(404).json({ message: 'missing name, major, or email' });
    return;
  }
  try {
    // create the new student
    const newStudent = {
      name: req.body.name,
      email: req.body.email,
      major: req.body.major,
    };
    const result = await dbLib.addStudent(db, newStudent);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newStudent } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

// implement the DELETE /student/id endpoint
webapp.delete('/student/:id', async (req, res) => {
  console.log('DELETE a student');
  try {
    const result = await dbLib.deleteStudent(db, req.params.id);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// implement the PUT /student/id endpoint
webapp.put('/student/:id', async (req, res) => {
  console.log('UPDATE a student');
  // parse the body of the request
  if (!req.body.major) {
    res.status(404).json({ message: 'missing major' });
    return;
  }
  try {
    const result = await dbLib.updateStudent(db, req.params.id, req.body.major);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});
