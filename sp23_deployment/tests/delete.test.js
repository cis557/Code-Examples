const request = require('supertest');
// Import MongoDB module
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../DbOperations');
const webapp = require('../server');

// import test utilities function
const { testStudent, insertTestDataToDB, deleteTestDataFromDB} = require('./testUtils');

let mongo;

// TEST PUT ENDPOINT
describe('Delete a student endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */
  let res;
  let db;
  let testStudentID;

  /**
     *  Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // add test user to mongodb
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
      await closeMongoDBConnection(); // mongo client started when running express.
    } catch (err) {
      return err;
    }
  });

  test('Endpoint response: status code, type and content', async () => {
    // successful deletion returns 200 status code
    const resp = await request(webapp).delete(`/student/${testStudentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    // the user is not in the database
    const resp1 = await db.collection('students').findOne({ _id: new ObjectId(testStudentID) });
    expect(resp1).toBeNull();
  });

  test('wrong user id format/exception - response 400', async () => {
    const resp = await request(webapp).delete('/student/1');
    expect(resp.status).toEqual(400);
  });

  test('user id not in system (correct id format) - response 404', async () => {
    const resp = await request(webapp).delete('/student/63738b602fe72e59d4a72ccc');
    expect(resp.status).toEqual(404);
  });
});
