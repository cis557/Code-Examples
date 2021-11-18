const dbLib = require('./dbOperationsMongoDB'); 
const profiles = require('./profiles');

let db;

  // cleanup the database after each test
  const clearDatabase = async (db) => {
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
  
  
  /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add - "jest": true -
   */


afterEach(async () => {
    await clearDatabase(db);
 });

 describe('Database operations tests', () => {
    // test data
    const testPlayer = {
      player: 'testuser',
      points: 0,
    };
    test('addPlayer inserts a new player', async () => {
        db = await dbLib.connect(profiles.url1);
        await dbLib.addPlayer(db, testPlayer);
        // find new user in the DB
        const insertedUser = await db.collection('players').findOne({ player: 'testuser' });
        expect(insertedUser.player).toEqual('testuser');
    });

    test('addPlayer exception', async () => {
      db = await dbLib.connect(profiles.url2);
      try{
        await dbLib.addPlayer(db, testPlayer)
      } catch(err){
        expect(err.message).toBe('Error executing the query');
      }
  });
});