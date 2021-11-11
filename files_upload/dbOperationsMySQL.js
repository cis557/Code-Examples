const mysql = require('mysql2/promise');

// Connect to our db on the cloud
const connect = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'database-1.chrcwgi8wrbt.us-east-1.rds.amazonaws.com',
      user: 'cis557',
      password: 'cis557+mysql',
      database: 'game_test',
    });
      // Connected to db
    console.log(`Connected to database: ${connection.connection.config.database}`);
    return connection;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// add an image
const addImage = async (db, newImage) => {
  const query = 'INSERT  INTO game_test.images (name , image) VALUES(?, ?)';
  const params = [newImage.name, newImage.image];
  try {
    const row = await db.execute(query, params);
    return row[0].insertId; // return id of new record
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

module.exports = {
  connect, addImage,
};
