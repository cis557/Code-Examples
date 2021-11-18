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
const profiles = require('./profiles');
let db;

  // cleanup the database after each test
const clearDatabase = async () => {
    await knex('players').where('player', 'testuser').del();
  };
  
  /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add - "jest": true -
   */
// setup 
// beforeAll(async () =>{
//    db = await dbLib.connect();
// });

afterEach(async () => {
    await clearDatabase();
    await db.end();
 });

 describe('Database operations tests', () => {
    // test data
    const testPlayer = {
      player: 'testuser',
      points: 0,
    };
    test('addPlayer inserts a new player', async () => {
        db = await dbLib.connect(profiles.profile1);
        await dbLib.addPlayer(db, testPlayer);
        const newPlayer = await knex.select('player').from('players').where('player', '=', 'testuser');
        expect(newPlayer[0].player).toBe('testuser');

    });
    test('addPlayer exception', async () => {
      db = await dbLib.connect(profiles.profile2);
      try{
        await dbLib.addPlayer(db, testPlayer)
      } catch(err){
        expect(err.message).toBe('Error executing the query');
      }
  });
});