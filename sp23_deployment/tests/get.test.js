const request = require('supertest');
const { closeMongoDBConnection, connect } = require('../DbOperations');
const webapp = require('../server');

// import test utilities function
const { isInArray, testStudent, insertTestDataToDB, deleteTestDataFromDB} = require('./testUtils');

let mongo;

// TEST POST ENDPOINT
describe('GET student(s) endpoint integration test', () => {
  /**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
*/
  let db;
  let testStudentID;
 
  /**
     * Make sure that the data is in the DB before running
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
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get all students endpoint status code and data', async () => {
    const resp = await request(webapp).get('/students/');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    console.log('isInArray--->', isInArray(studArr, testStudentID));
    expect(isInArray(studArr, testStudentID)).toBe(true);
  });

  test('Get a student endpoint status code and data', async () => {
    const resp = await request(webapp).get(`/student/${testStudentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const studArr = JSON.parse(resp.text).data;
    // testStudent is in the response
    expect(studArr).toMatchObject({ _id: testStudentID, ...testStudent });
  });

  test('user not in db status code 404', async () => {
    const resp = await request(webapp).get('/student/1');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  });
});
