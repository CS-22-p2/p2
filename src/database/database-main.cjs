//const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://p2Access:cs23sw202@bmpnj.duckdns.org:27017/p2?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("We in!");
    
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function getCollections(client) {
  const collectionsList = await client.db("p2").getCollectionNames();

  return collectionsList;
}

// This function creates a new entry into the specified collection if the collection exist
async function createEntry(client, newEntry, collection) {
  // First we find all the collections present in the database
  const collectionNames = getCollections(client);
  // If the specified collection is present we insert the new entry and return true
  // else it returns false without inserting the new entry
  if (collectionNames.includes(collection)) {
    const result = await client.db("p2").collection(collection).insertOne(newEntry);
    console.log(`New entry created with the following id: ${result.insertedId}`);
  
    return true;
  }
  return false;
}