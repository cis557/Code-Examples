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
    const [row] = await db.execute(query, params);
    console.log(`Created player with id: ${row.insertId}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// get all players
const getPlayers = async (db) => {
  try {
    const query = 'SELECT * FROM game_test.players';
    const [rows] = await db.execute(query);
    console.log(`Players: ${JSON.stringify(rows)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// delete player by name
const deletePlayer = async (db, name) => {
  try {
    const query = 'DELETE FROM game_test.players WHERE player=?';
    const [row] = await db.execute(query, [name]);
    console.log(`Deleted ${JSON.stringify(row.affectedRows)} player(s)`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// update a player - lecture activity

const operations = async () => {
  const db = await connect();
  await getPlayers(db);
  addPlayer(db, { player: 'testuser', points: 0 });
  await getPlayers(db);
  await deletePlayer(db, 'testuser');
  await getPlayers(db);
};

operations();
