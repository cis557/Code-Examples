// Express app file

// (1) import express
// backend ==> require
const express = require('express');

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require('cors');

// import json web token
const jwt = require('jsonwebtoken');

// secret key
const secret = 'thi_iSz_a_Very_$trong&_$ecret_queYZ';

// Import authentication operations
const auth = require('./auth');

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

// (6) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));

// (7) import the db interactions module
const dbLib = require('./dbFunctions');

// root endpoint / route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'welcome to our backend!!!' });
});

// implement the GET /students endpoint
webapp.get('/students', async (req, res) => {
  console.log('READ all students');
  if (await auth.authenticateUser(req.headers.authorization, secret)) {
    try {
      const results = await dbLib.getAllStudents();
      res.status(200).json({ data: results });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
});

// implement the GET /student/:id endpoint
webapp.get('/student/:id', async (req, res) => {
  console.log('READ a student');
  try {
    // get the data from the db
    const results = await dbLib.getAStudent(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown student' });
      return;
    }
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
    const result = await dbLib.addStudent(newStudent);
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
    const result = await dbLib.deleteStudent(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'student not in the system' });
      return;
    }
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
    const result = await dbLib.updateStudent(req.params.id, req.body.major);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * Login endpoint
 */

webapp.post('/login', (req, res) => {
  console.log('create a new session');
  // check that the username was sent
  if (!req.body.username) {
    res.status(401).json({ error: 'missing username' });
    res.end();
  }
  // sing the token and send it to the frontend
  try {
    const jwtoken = jwt.sign({ username: req.body.username }, secret, { expiresIn: '120s' });
    res.status(201).json({ token: jwtoken });
  } catch (err) {
    res.status(401).json({ error: 'there was an error' });
  }
});

// catch all endpoint
webapp.use((req, resp) => {
  resp.status(404).json({ error: 'invalid endpoint' });
});

// do not forget to export the express server
module.exports = webapp;
