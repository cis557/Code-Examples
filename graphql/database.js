const sqlite3 = require('sqlite3').verbose();

const DB_NAME = 'studentsdb.sqlite';

const db = new sqlite3.Database(DB_NAME, (err) => {
  if (err) {
    // error opening database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE student (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            major text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
    (othererr) => {
      if (othererr) {
        // error creating table
        console.error(othererr.message);
      } else {
        // Add data to the table
        const insert = 'INSERT INTO student (name, email, major) VALUES (?,?,?)';
        db.run(insert, ['Ida Mae', 'ida@cis.upenn.edu', 'Computer Science']);
        db.run(insert, ['George Starling', 'gstarling@upenn.edu', 'History']);
        db.run(insert, ['Rob Foster', 'rob@upenn.edu', 'Sociology']);
      }
    });
  }
});


module.exports = db;
