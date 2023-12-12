/**
 * Express webserver / controller
 */

// import express
const express = require('express');

// import the cors -cross origin resource sharing- module
const cors = require('cors');

// import path
const path = require('path');

// create a new express app
const webapp = express();

// import authentication functions
const { authenticateUser, verifyUser } = require('./utils/auth')
// enable cors
webapp.use(cors());

// configure express to parse request bodies
webapp.use(express.urlencoded({extended: true}));

// import the db function
const dbLib = require('./DbOperations');

// tell express where to find static files
webapp.use(express.static(path.join(__dirname,'./StudentsAppFrontend/build')));

// root endpoint route
webapp.get('/', (req, resp) =>{
    resp.json({message: 'hello CIS3500 friends!!! You have dreamy eyes'})
});


/**
 * Login endpoint
 * The name is used to log in
 */
webapp.post('/login', (req, resp)=>{
  // check that the name was sent in the body
  if(!req.body.name || req.body.name===''){
    resp.status(401).json({error: 'empty or missing name'});
    return;
  }
  // authenticate the user
  try{
    const token = authenticateUser(req.body.name);
    resp.status(201).json({apptoken: token});

  } catch(err){
    resp.status(401).json({error: 'hey I am an error'});
  }
})

/**
 * route implementation GET /students
 */
webapp.get('/students', async (req, resp)=>{
    try{
        // get the data from the DB
        const students = await dbLib.getStudents();
        // send response
        resp.status(200).json({data: students});

    } catch(err){
        // send the error code
        resp.status(400).json({message: 'There was an error'});

    }
});

/**
 * route implementation GET /student/:id
 */
webapp.get('/student/:id', async (req, res) => {
    console.log('READ a student');
    try {
      // get the data from the db
      const results = await dbLib.getStudent(req.params.id);
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

/**
 * route implementation POST /student
 * validate the session
 */
webapp.post('/student', async (req, resp) =>{
    // parse the body
    if(!req.body.name || !req.body.email || !req.body.major){
        resp.status(404).json({message: 'missing name, email or major in the body'});
        return;
    }
    // verify the session
    if(await verifyUser(req.headers.authorization)){
        try{
          // create the new student object
          const newStudent = {
            name: req.body.name,
            email: req.body.email,
            major: req.body.major
          }
          const result = await dbLib.addStudent(newStudent);
          resp.status(201).json({data: {id: result}});

      }catch(err){
        resp.status(400).json({message: 'There was an error'});
      }
    }
    else{
      resp.status(401).json({message: 'Failed Authentication'});
    }
    

});

/**
 * route implementation DELETE /student/:id
 */
webapp.delete('/student/:id', async (req, res) => {
    try {
      const result = await dbLib.deleteStudent(req.params.id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'student not in the system' });
        return;
      }
      // send the response with the appropriate status code
      res.status(200).json({ message: result });
    } catch (err) {
      res.status(400).json({ message: 'there was error' });
    }
  });
  
  /**
 * route implementation PUT /student/:id
 */
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

  // add wildcard endpoint - serve react files
webapp.get('*',(req, resp) =>{
  resp.send(path.join(__dirname, './StudentsAppFrontend/build/index.html'))
})


// export the webapp
module.exports = webapp;
