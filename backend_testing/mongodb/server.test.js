const request = require('supertest');
// Import MongoDB module
const { MongoClient } = require('mongodb');


// URL of db on the cloud
const url = 'mongodb+srv://cis557:cis557_fa20@cluster0.lp2ui.mongodb.net/hw5_game?retryWrites=true&w=majority';

// Connect to our db on the cloud
const connect = async () => {
  try {
    const tmp = (await MongoClient.connect(url,
      { useNewUrlParser: true, useUnifiedTopology: true })).db();
    // Connected to db
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const webapp = require('./server');

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -"jest": true-
 */
let db;
beforeAll(async () => {
  db = await connect();
});

const clearDatabase = async () => {
  try {
    const result = await db.collection('players').deleteOne({ player: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted player');
    } else {
      console.log('warning', 'player was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

afterAll(async () => {
  await clearDatabase();
});


describe('Create player endpoint integration test', () => {
  // expected response
  const testPlayer = {
    player: 'testuser',
    points: 0,
  };
  test('Endpoint status code and response', () => request(webapp).post('/player/').send('username=testuser')
    .expect(200)
    .then((response) => {
      // toMatchObject check that a JavaScript object matches
      // a subset of the properties of an object
      const { player } = JSON.parse(response.text);
      id = player._id;
      expect(player).toMatchObject(testPlayer);
    }));

  test('The new player is in the database', async () => {
    const insertedUser = await db.collection('players').findOne({ player: 'testuser' });
    expect(insertedUser.player).toEqual('testuser');
  });
});
