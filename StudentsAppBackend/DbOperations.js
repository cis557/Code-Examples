// this is a node app, we must use commonJS modules/ require
// the names of the functions come from the operationId field 
/**
 * This module implements model queries functions
 * the names of the functions come from the operationId field
 * in the API documentation 
 */

// import the mongodb driver
const { MongoClient } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

// the mongodb server URL
const dbURL = 'mongodb+srv://test:cis3500-2023@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority';

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    // check that we are connected to the db
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};
/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

/**
 * READ all the students (HTTP GET /students) 
 * https://app.swaggerhub.com/apis/ericfouh/StudentsRoster_App/1.0.0#/students/getStudents
 * @returns list/array of all the students enrolled in the course
 */
const getStudents = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('students').find({}).toArray();
    // print the results
    console.log(`Students: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// getStudents();

/**
 * CREATE a new student (HTTP POST /student)
 * https://app.swaggerhub.com/apis/ericfouh/StudentsRoster_App/1.0.0#/students/addStudent
 * @param {newStudent}   the new student object
 * @returns the id of the new student
 */
const addStudent = async (newStudent) => {
  // get the db
  const db = await getDB();
  const result = await db.collection('students').insertOne(newStudent);
  return result.insertedId;
  
/**  This is a callback version of a mongodb query
  db.collection('students').insertOne(
    newStudent,
    (err, result) => {
      // if there was an error
      if (err) {
        console.log(`error: ${err.message}`);
      }
      // print the id of the student
      console.log(`New student created with id: ${result.insertedId}`);
      // return the result
      return result.insertedId;
    },
  );
  */
};

/**
 * READ a student (HTTP GET /student/:id)
 * https://app.swaggerhub.com/apis/ericfouh/StudentsRoster_App/1.0.0#/students/getStudent
 * @param {studentID}  the id of the student 
 * @returns the student data
 */
const getStudent = async (studentID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('students').findOne({ _id: new ObjectId(studentID) });
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};
//getAStudent('641cbbba7307d82e8c2fff67');
/**
 * UPDATE a student (PUT /student/:id)
 * https://app.swaggerhub.com/apis/ericfouh/StudentsRoster_App/1.0.0#/students/updateStudent
 * @param {studentID}  the id of the student
 * @param {newMajor} the new major of the student 
 * @returns 
 */
const updateStudent = async (studentID, newMajor) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('students').updateOne(
      { _id: ObjectId(studentID) },
      { $set: { major: newMajor } },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

/**
 * DELETE a student (DELETE /student/:id)
 * https://app.swaggerhub.com/apis/ericfouh/StudentsRoster_App/1.0.0#/students/deleteStudent
 * @param {studentID} the id of the student 
 * @returns the result/status of the delete operation
 */

const deleteStudent = async (studentID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('students').deleteOne(
      { _id: ObjectId(studentID) },
    );
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
