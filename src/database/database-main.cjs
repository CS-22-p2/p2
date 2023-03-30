//const MongoClient = require('mongodb').MongoClient;
const { debug } = require('console');
const { MongoClient } = require('mongodb');

// This function connects to the specified mongo server and returns a client for use in other functions
async function establishConnection() {
  const uri = "mongodb://p2Access:cs23sw202@bmpnj.duckdns.org:27017/p2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("We in!");

    return client;
  } catch (error) {
    console.error(error);
  } 
}

// This function inserts a new entry into the specified collection if the collection exist
async function insertEntry(newEntry, collection) {
  let client;
  try {
    //Connect to the mongo server
    client = await establishConnection();

    // Get all the collections present in the database and extract their names
    const collections = await client.db("p2").listCollections().toArray();
    const collectionNames = [];
    collections.forEach(ele => collectionNames.push(ele.name));
    console.log(collectionNames);
    // If the specified collection is present we insert the new entry and return true
    // else it returns false without inserting the new entry
    if (collectionNames.includes(collection)) {
      const result = await client.db("p2").collection(collection).insertOne(newEntry);
      console.log(`New entry created with the following id: ${result.insertedId}`);
    
      return true;
    }
    console.log("Nothing happend");
    return false;
  } catch (error) {
    console.error(error)
  } finally {
    await client.close();
  } 
}

const result = insertEntry({fName: "Anna", lName: "johnson", age: 16, gender: 1}, "userdb");