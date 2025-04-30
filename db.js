const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "scms";

async function connect() {
  await client.connect();
  console.log("Connected to MongoDB");
  return client.db(dbName);
}

module.exports = connect;
