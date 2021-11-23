
// Create express app
const express = require('express');

// Cross-origin resource sharing https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
const cors = require('cors');

// security feature. JSON web token - https://jwt.io
const jwt = require('jsonwebtoken');

const webapp = express();


// web socket
const WebSocket = require('ws');

// enable cors in our express app
webapp.use(cors());
// Help with parsing body of HTTP requests
const bodyParser = require('body-parser');


// Server port
const port = 8080;

// JSON web token creation
const serverToken = jwt.sign({
  name: 'webserver',
}, 'this_is_a_secret', { expiresIn: '1h' });

// websocket server url
const url = 'ws://localhost:8085/';

// websocket connection with jwt
const connection = new WebSocket(url, {
  headers: { token: serverToken },
});

connection.onopen = () => {
  connection.send('["webserver"]');
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
  console.log(e.data);
};

// Set of users 
const users = new Set();

webapp.use(express.urlencoded({
  extended: true,
}));
// Start web server
webapp.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to our chat app' });
});



// login endpoint - returns the user's jwt 
// adds the user to the set of users if first time
webapp.post('/login', (req, res) => {
  console.log('Register user');
  if (!req.body.username) {
    res.status(400).json({ error: 'missing username' });
    return;
  }
  const username = req.body.username;
  if(!users.has(username)){
    users.add(username);
  }
  let userToken;
  
    // create and send JWT to a the user
    userToken = jwt.sign({
      name: username,
    }, 'this_is_a_secret', { expiresIn: '1h' });

    // Notify WS Server to update all connected clients
    const msg = {type: 'new user', data: username}
    connection.send(JSON.stringify(msg));  
  res.json({ user: username, token: userToken });
});

// users endpoint
webapp.get('/users', (_req, res) => {
  console.log('READ all users');
    res.json({
      data: Array.from(users),
    });
});


// message endpoint
webapp.post('/message/', (req, res) => {
  console.log('Received a message');
  if (!req.body.to || !req.body.from || !req.body.message) {
    res.status(400).json({ error: 'missing to or from or message' });
    return;
  }
  // check if user is valid
  if(!users.has(req.body.from)){
    res.status(401).json({ error: 'unauthorized user' });
    return;
  }
    const msg = {type: 'message', data: {to: req.body.to, from: req.body.from, message: req.body.message}}
    // Notify WS Server
    connection.send(JSON.stringify(msg)); 
    res.json({
      message: 'message received',
    });
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
