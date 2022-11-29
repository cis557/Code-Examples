// import express
const express = require('express');

// create our express app
const webapp = express();


const cors = require('cors');




//configure the app to handle JSON and to parse request body
webapp.use(express.json());
webapp.use(express.urlencoded({
    extended: true,
}));

//tell express to use cors
webapp.use(cors({ credentials: true, origin: true}))


// security feature. JSON web token - https://jwt.io
const jwt = require('jsonwebtoken');

// Websocket configuration
// JSON web token creation
const serverToken = jwt.sign({
  name: 'webserver',
}, 'this_is_a_secret', { expiresIn: '1h' });

// web socket
const WebSocket = require('ws');

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



// login endpoint - returns the user's jwt 
// adds the user to the set of users if first time
webapp.post('/login', (req, res) => {
    console.log('Register user');
    if (!req.body.username) {
      res.status(400).json({ error: 'missing username' });
      return;
    }
    
      // create and send JWT to a the user
      const userToken =  jwt.sign({
        name: req.body.username,
      }, 'this_is_a_secret', { expiresIn: '1h' });
 
      // Notify WS Server to update all connected clients
    const msg = {type: 'new user', data: req.body.username}
    connection.send(JSON.stringify(msg));  
    res.json({ token: userToken });
  });

// verify session
webapp.post('/verify', (req, res) => {
    console.log('verify session user');
    if (!req.body.token) {
      res.status(400).json({ error: 'missing token' });
      return;
    }
    // verify the user token
    jwt.verify(userToken, 'this_is_a_secret_key', function(err, ){
      if(err){
          
          // check if the error is an expiration error
          if(err.name === 'TokenExpiredError'){
              res.status(302).json({error: 'session expired'});
              return;
          }
      }
      res.json({message: 'session valid'});
    });
});


// new message endpoint
webapp.post('/message/', (req, res) => {
  if (!req.body.to || !req.body.from || !req.body.message) {
    res.status(400).json({ error: 'missing to or from or message' });
    return;
  }
    // create message for the WS server
    const msg = {type: 'message', data: {to: req.body.to, from: req.body.from, message: req.body.message}}
    // Notify the ws Server
    connection.send(JSON.stringify(msg)); 
    res.json({
      message: 'message received',
    });
});


// Server port
const port = 8080;
// Start web server
webapp.listen(port, () => {
    console.log(`Server running on port:${port}`);
});

