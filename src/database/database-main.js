// Imports
import { MongoClient } from 'mongodb';

// Exports
export { insertEntry, getEntry }

// This function connects to the specified mongo server and returns a client for use in other functions
async function establishConnection() {
    const uri = "mongodb://p2Access:cs23sw202@192.168.0.127:27017/p2?retryWrites=true&w=majority";
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
    }
    console.log("Nothing happend");
    return false;
    } catch (error) {
        console.error(error)
    } finally {
        await client.close();
    } 
}

// This function returns an entry specified by name and collection
async function getEntry (query, collection) {
    let client;
    try {
    client = await establishConnection();

    // Get all the collections present in the database and extract their names
    const collections = await client.db("p2").listCollections().toArray();
    const collectionNames = [];
    collections.forEach(ele => collectionNames.push(ele.name));
    // If the specified collection is present we serch for the query and return true if present
    // else it returns false
    if (collectionNames.includes(collection)) {
        const result = await client.db("p2").collection(collection).findOne({fName: query}); // We need to figure out how to make  dynamic querys: https://stackoverflow.com/questions/39986639/dynamic-query-mongodb

        if (result) {
            console.log(`Found a entry in the collection with the name '${query}':`);
            return result;
        } else {
            console.log(`No entrys found with the name '${query}'`);
            return false
        }
    }
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

//const result = getEntry("Anna", "userdb");
//const result = insertEntry({fName: "Emma", lName: "smith", age: 16, gender: 1}, "userdb");

console.log(result);