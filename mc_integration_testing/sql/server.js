// Create express app
const express = require('express');

const webapp = express();

// Help with parsing body of HTTP requests
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
  res.json({ message: 'Welcome to HW5 Backend' });
});

// Other API endpoints
webapp.get('/players', (req, res) => {
  console.log('READ all players');
  const sql = 'select * from players';
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

webapp.post('/player/', (req, res) => {
  console.log('CREATE a player');

  if (!req.body.username) {
    res.status(400).json({ error: 'missing username' });
    return;
  }

  // create player object
  const newPlayer = {
    name: req.body.username,
    points: 0,
  };
  // insert newPlayer
  const sql = 'INSERT INTO players (player, points) VALUES (?,?)';
  const values = [newPlayer.name, newPlayer.points];
  db.run(sql, values, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    res.json({
      message: 'success',
      player: newPlayer,
      id: this.lastID,
    });
  });
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
