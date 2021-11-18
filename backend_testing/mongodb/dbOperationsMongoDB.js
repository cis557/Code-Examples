// Import MongoDB module
const { MongoClient } = require('mongodb');
// Import ObjectID constructor
const { ObjectId } = require('mongodb');
// Connect to our db on the cloud
const connect = async (url) => {
  try {
    const tmp = (await MongoClient.connect(url,
      { useNewUrlParser: true, useUnifiedTopology: true })).db();
    // Connected to db
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw new Error('could not connect to the db');
  }
};


// add a player
const addPlayer = async (db, newPlayer) => {
  try {
    const result = await db.collection('players').insertOne(newPlayer);
    console.log(`Created player with id: ${result.insertedId}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error('Error executing the query');
  }
};

// get a player by id
const getPlayer = async (db, id) => {
  try {
    const result = await db.collection('players').findOne({ _id: ObjectId(id) });
    console.log(`Player: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// get all players
const getPlayers = async (db) => {
  try {
    const results = await db.collection('players').find({}).toArray();
    console.log(`Players: ${JSON.stringify(results)}`);
    return results;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// delete player by name
const deletePlayer = async (db, name) => {
  try {
    const record = await db.collection('players').findOne({ player: name });
    console.log(`record: ${JSON.stringify(record)}`);
    // delete record by id
    const deleted = await db.collection('players').deleteOne({ _id: record._id });
    console.log(`Deleted: ${JSON.stringify(deleted)}`);
    return deleted;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

module.exports = {
  connect, addPlayer, getPlayers, getPlayer, deletePlayer,
};