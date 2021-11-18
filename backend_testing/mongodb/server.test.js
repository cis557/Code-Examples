const request = require('supertest');
const profiles = require('./profiles');
// Import database operations
const dbLib = require('./dbOperationsMongoDB');


const webapp = require('./server');

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -"jest": true-
 */
let db;


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

beforeAll(async () =>{
  db = await dbLib.connect(profiles.url1);
});

afterEach(async () => {
  await clearDatabase();
});


describe('Create player endpoint API & integration tests', () => {
  test('status code and response missing points', () => 
  request(webapp).post('/player/').send('player=testuser')
  .expect(404) // testing the response status code
  .then((response) => {
    expect(JSON.parse(response.text).error).toBe('missing name or points');
  }));
  
  // expected response without the id
  const testPlayer = {
    player: 'testuser',
    points: '5',
  };
    test('Endpoint status code and response', () => 
    request(webapp).post('/player/').send('player=testuser&points=5')
    .expect(201)
    .then((response) => {
      
      const { player } = JSON.parse(response.text);
      id = player._id; // we add the id returned to testPlayer
      expect(player).toMatchObject(testPlayer);
    }));

 
  test('The new player is in the database', () => 
  request(webapp).post('/player/').send('player=testuser&points=5')
    .expect(201)
    .then(async () => {
      const insertedUser = await db.collection('players').findOne({ player: 'testuser' });
      expect(insertedUser.player).toEqual('testuser');
    }));
  
});
