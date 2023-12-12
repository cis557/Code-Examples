// import supertest
const request = require('supertest');
// import the function to close the mongodb connection
const { closeMongoDBConnection, connect } = require('../DbOperations');

// import the express server
const webapp = require('../server');

// import test utilities function
const { deleteTestDataFromDB } = require('./testUtils');

// connection to the DB
let mongo;

describe('POST /student enpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  /**
     * We need to make the request to the endpoint
     * before running any test.
     * We need to connecto the DB for all the DB checks
     * If beforeAll is undefined
     * inside .eslintrc.js, add 'jest' to the 'env' key
     */
  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // get the db
    db = mongo.db();

    // send the request to the API and collect the response
    response = await request(webapp).post('/student')
      .send('name=testuser&major=music&email=a@upenn.edu');
  });

  /**
 * After running the tests, we need to remove any test data from the DB
 * We need to close the mongodb connection
 */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await deleteTestDataFromDB(db, 'testuser');;
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
  });

  /**
 * Status code and response type
 */
  test('the status code is 201 and response type', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  /**
 * response body
 */
  test('the new student is in the returned data', () => {
    // expect the id of the new student to not be undefined
    console.log('returned data id', JSON.parse(response.text).data.id);
    expect(JSON.parse(response.text).data.id).not.toBe(undefined);
  });

  test('The new student is in the database', async () => {
    const insertedUser = await db.collection('students').findOne({ name: 'testuser' });
    expect(insertedUser.name).toEqual('testuser');
  });

  test('missing a field (email) 404', async () => {
    const res = await request(webapp).post('/student/')
      .send('name=testuser&major=cis');
    expect(res.status).toEqual(404);
  });
});
