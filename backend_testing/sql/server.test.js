// http://knexjs.org/#Installation-client for MySQL connection
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'database-1.chrcwgi8wrbt.us-east-1.rds.amazonaws.com',
    port : 3306,
    user : 'cis557',
    password : 'cis557+mysql',
    database : 'game_test'
  }
});

const dbLib = require('./dbOperationsMySQL'); 
let db;
const request = require('supertest');
const webapp = require('./server');

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('players').where('player', 'testuser').del();
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */
 beforeAll(async () =>{
  db = await dbLib.connect();
});

afterEach(async () => {
   await clearDatabase();
});

describe('Create player endpoint API & integration test', () => {
  // expected response
  const testPlayer = {
    player: 'testuser',
    points: 5,
  };
  test('status code and response missing points', () => 
  request(webapp).post('/player/').send('player=testuser')
  .expect(404)
  .then((response) => {
    expect(JSON.parse(response.text).error).toBe('missing name or points');
  }));

  test('Endpoint status code and response', () => request(webapp).post('/player/').send('player=testuser&points=5')
    .expect(201)
    .then((response) => {
      expect(JSON.parse(response.text).player).toHaveProperty('player', 'testuser');
    }));
 
  test('The new player is in the database', () => request(webapp).post('/player/').send('player=testuser&points=5')
    .expect(201)
    .then(async () => {
      const newPlayer = await knex.select('player').from('players').where('player', '=', 'testuser');
      expect(newPlayer[0].player).toBe('testuser');
    }));
});
