// Create express app
const express = require('express');

const webapp = express();

// Help with parsing body of HTTP requests
const bodyParser = require('body-parser');

// Import MongoDB module
const { MongoClient } = require('mongodb');

// Import ObjectID constructor
const ObjectId = require('mongodb').ObjectID;

// URL of db on the cloud
const url =   'mongodb+srv://cis557:cis557_fa20@cluster0.lp2ui.mongodb.net/hw5_game?retryWrites=true&w=majority';

// Connect to our db on the cloud
const connect = async () => {
  try {
    const tmp = (await MongoClient.connect(url, 
      { useNewUrlParser: true, useUnifiedTopology: true })).db();
    // Connected to db
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// Server port
const port = 8080;

webapp.use(bodyParser.urlencoded({
  extended: true,
}));
// Start server
let db;
webapp.listen(port, async () => {
  db = await connect();
  console.log(`--Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (req, res) => {
  res.json({ message: 'Welcome to HW5 Backend' });
});

// Other API endpoints
webapp.get('/players', (req, res) => {
  console.log('READ all players');
  db.collection('players').find({}, (err, result) => {
    if (err) {
      // error querying the database
      res.status(400).json({ error: err.message });
      return;
    }
    result.toArray((err1, docs) => {
      if (err1) {
        // error converting result to array
        res.status(400).json({ error: err1.message });
        return;
      }
      res.json({
        message: 'success',
        data: docs,
      });
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
    player: req.body.username,
    points: 0,
  };
  // insert newPlayer
  db.collection('players').insertOne(newPlayer, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      player: newPlayer,
    });
  });
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
