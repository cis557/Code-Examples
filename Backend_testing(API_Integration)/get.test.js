const request = require('supertest');
const { closeMongoDBConnection, connect } = require('./dbFunctions');
const webapp = require('./server');

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
  // test resource to create / expected response
  const testStudent = { name: 'testuser', major: 'cis', email: 'klaus@upenn.edu' };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/student/')
      .send('name=testuser&major=cis&email=klaus@upenn.edu');
    // eslint-disable-next-line no-underscore-dangle
    testStudentID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('students').deleteOne({ name: 'testuser' });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        console.log('info', 'Successfully deleted test student');
      } else {
        console.log('warning', 'test student was not deleted');
      }
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
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
    expect(studArr).toEqual(expect.arrayContaining([{ _id: testStudentID, ...testStudent }]));
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
