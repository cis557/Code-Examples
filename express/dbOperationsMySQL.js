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

// add a player
const addPlayer = async (db, newPlayer) => {
  const query = 'INSERT  INTO game_test.players (player , points) VALUES(?, ?)';
  const params = [newPlayer.player, newPlayer.points];
  try {
    const row = await db.execute(query, params);
    return row[0].insertId; // return id of new record
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get player by id
const getPlayer = async (db, id) => {
  try {
    const query = 'select * from game_test.players where id = ?';
    const params = [id];
    const row = await db.execute(query, params);
    return row[0][0];
  } catch (err) {
    throw new Error('Error executing the query');
  }
};

// get all players
const getPlayers = async (db) => {
  try {
    const query = 'SELECT * FROM game_test.players';
    const [rows] = await db.execute(query);
    return rows[0];
  } catch (err) {
    console.log(`Error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

// delete player by name
const deletePlayer = async (db, name) => {
  try {
    const query = 'DELETE FROM game_test.players WHERE player=?';
    const [row] = await db.execute(query, [name]);
    return row.affectedRows; // number of records deleted
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

// update a player

module.exports = {
  connect, addPlayer, getPlayer, getPlayers, deletePlayer,
};
