// Create express app
const express = require('express');

const cors = require('cors');

const webapp = express();

webapp.use(cors());

const bodyParser = require('body-parser');

// Import database
const db = require('./database.js');

// Server port
const port = 8080;

webapp.use(bodyParser.urlencoded({
  extended: true,
}));
// Start server
webapp.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (req, res) => {
  // connection.send('Hello');
  res.json({ message: 'Welcome to our first REST API' });
});

webapp.get('/login/', async (req, res) => {
  res.json({ value: 1 }); // fake authentication
});

// Other API endpoints
webapp.get('/students', (_req, res) => {
  console.log('READ all students');
  const sql = 'select * from student ORDER BY major ASC';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

webapp.get('/student/:id', (req, res) => {
  console.log('READ a student by id');
  const sql = 'select * from student where id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

webapp.post('/student/', (req, res) => {
  console.log('CREATE a student');
  if (!req.body.name || !req.body.email || !req.body.major) {
    res.status(400).json({ error: 'missing name or email or major' });
    return;
  }
  // create student object
  const newStudent = {
    name: req.body.name,
    email: req.body.email,
    major: req.body.major,
  };
  // insert newStudent
  const sql = 'INSERT INTO student (name, email, major) VALUES (?,?,?)';
  const values = [newStudent.name, newStudent.email, newStudent.major];
  db.run(sql, values, function (err, _result) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      student: newStudent,
      id: this.lastID,
    });
  });
});

webapp.put('/student/:id', (req, res) => {
  console.log('UPDATE a student');
  const updatedStudent = {
    name: req.body.name,
    email: req.body.email,
    major: req.body.major,
  };
  db.run(
    `UPDATE student set 
           name = ?, 
           email = ?, 
           major = ? 
           WHERE id = ?`,
    [updatedStudent.name, updatedStudent.email, updatedStudent.major, req.params.id],
    function (err) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: 'success',
        data: updatedStudent,
        changes: this.changes,
      });
    },
  );
});

webapp.delete('/student/:id', (req, res) => {
  console.log('DELETE a student');
  db.run(
    'DELETE FROM student WHERE id = ?',
    req.params.id,
    function (err) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: 'deleted', changes: this.changes });
    },
  );
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});
