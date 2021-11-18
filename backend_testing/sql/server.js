// import express
const express = require('express');

// enable cross-origin resource sharing (cors)
const cors = require('cors');

// Create express app
const webapp = express();

webapp.use(cors());

// Import database operations
const lib = require('./dbOperationsMySQL');

// Server port
const port = 8080;

webapp.use(express.urlencoded({
  extended: true,
}));

// declare DB connection handle
let db;
const profiles = require('./profiles');

// Start server and connect to the DB
webapp.listen(port, async () => {
  db = await lib.connect(profiles.profile1);
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to our web app' });
});

// Other API endpoints
webapp.get('/players', async (_req, res) => {
  console.log('READ all players');
  try {
    const results = await lib.getPlayers(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/player/:id', async (req, res) => {
  console.log('READ a player by id');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'id is missing' });
      return;
    }
    const result = await lib.getPlayer(db, req.params.id);
    if (result === undefined) {
      res.status(404).json({ error: 'bad user id' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.post('/player/', async (req, res) => {
  console.log('CREATE a player');
  if (!req.body.player || !req.body.points) {
    res.status(404).json({ error: 'missing name or points' });
    return;
  }
  // create new player object
  const newPlayer = {
    player: req.body.player,
    points: req.body.points,
  };
  try {
    const result = await lib.addPlayer(db, newPlayer);
    console.log(`id: ${JSON.stringify(result)}`);
    // add id to new player and return it
    res.status(201).json({
      player: { id: result, ...newPlayer },
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/player/:player', async (req, res) => {
  if (req.params.player === undefined) {
    res.status(404).json({ error: 'name is missing' });
    return;
  }
  console.log('DELETE a player');
  try {
    const result = await lib.deletePlayer(db, req.params.player);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'player not in the system' });
      return;
    }
    res.status(200).json({ message: `Deleted ${result} player(s) with name ${req.params.player}` });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
