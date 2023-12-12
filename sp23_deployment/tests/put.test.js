const request = require('supertest');
// Import MongoDB module
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../DbOperations');
const webapp = require('../server');
// import test utilities function
const { testStudent, insertTestDataToDB, deleteTestDataFromDB} = require('./testUtils');

let mongo;

// TEST PUT ENDPOINT
describe('Update a student endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */

  let res;
  let db;
  let testStudentID; // will store the id of the test student

  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // add test user to mongodb
    // const result = await db.collection('students').insertOne(testStudent);
    testStudentID = await insertTestDataToDB(db, testStudent);
    console.log('testStudentID', testStudentID);
  });

/**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromDB(db, 'teststudent');
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Endpoint status code and response async/await', async () => {
    res = await request(webapp).put(`/student/${testStudentID}`)
      .send('major=music');
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/json');

    // the database was updated
    const updatedUser = await db.collection('students').findOne({ _id: new ObjectId(testStudentID) });
    expect(updatedUser.major).toEqual('music');
  });

  test('missing major 404', async () => {
    res = await request(webapp).put(`/student/${testStudentID}`)
      .send('name=music');
    expect(res.status).toEqual(404);
  });
});
