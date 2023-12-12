/**
 * This module will start the express server
 */

// import the express app
const webapp = require('./server');

// update port
const port = process.env.PORT || 8080;
// start the web server
webapp.listen(port, () =>{
    console.log('Server running on port', port);
})