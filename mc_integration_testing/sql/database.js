const sqlite3 = require('sqlite3').verbose();

const DB_NAME = 'playersdb.sqlite';

const db = new sqlite3.Database(DB_NAME, (err) => {
  if (err) {
    // error opening database
    console.error(err.message);
    // throw err; // we don't want to throw the exception in our tests
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player text UNIQUE, 
            points integer, 
            CONSTRAINT player_unique UNIQUE (player)
            )`,
    (othererr) => {
      if (othererr) {
        // error creating table
        console.log(othererr.message);
      }
    });
  }
});


module.exports = db;
