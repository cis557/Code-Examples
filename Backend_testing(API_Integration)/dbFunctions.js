// this is a node app, we must use commonJS modules/ require

// import the mongodb driver
const { MongoClient } = require('mongodb');

// import ObjectID
const { ObjectId } = require('mongodb');

// the mongodb server URL
const dbURL = 'mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority';

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

// CREATE a new student
// takes a db connector and a student object
// and add the user to the DB
const addStudent = async (newStudent) => {
  // get the db
  const db = await getDB();
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
};

// READ all students
// await/async syntax
const getAllStudents = async () => {
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

// READ a student given their ID
const getAStudent = async (studentID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('students').findOne({ _id: ObjectId(studentID) });
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a student given their ID
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

// DELETE a student given their ID
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
  getAllStudents,
  getAStudent,
  updateStudent,
  deleteStudent,
};
