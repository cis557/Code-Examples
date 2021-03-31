// http://knexjs.org/#Installation-client for MySQL connection
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'playersdb.sqlite',
  },
  useNullAsDefault: true,
});

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

afterEach(async () => {
  await clearDatabase();
});

describe('Create player endpoint integration test', () => {
  // expected response
  const testPlayer = {
    name: 'testuser',
    points: 0,
  };
  test('Endpoint status code and response', () => request(webapp).post('/player/').send('username=testuser')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).player).toStrictEqual(testPlayer);
    }));

  test('The new player is in the database', () => request(webapp).post('/player/').send('username=testuser')
    .expect(200)
    .then(async () => {
      const newPlayer = await knex.select('player').from('players').where('player', '=', 'testuser');
      expect(newPlayer[0].player).toBe('testuser');
    }));
});
