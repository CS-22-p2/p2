// Imports
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Exports
export { insertEntry, getEntry, getNewestEntries, establishConnection, serchAllFields }

dotenv.config();
// This function connects to the specified mongo server and returns a client for use in other functions
async function establishConnection() {
    const uri = process.env.database_url;
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

// This function might be deprecated
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
        setTimeout(() => {client.close()}, 1500);
    }
}

// When calling for entries for the main page start from 0, and increment when ever button pressed

async function getNewestEntries(collection, skip) {
    let client;
    let result = [];
    try {
    client = await establishConnection();

    // Get all the collections present in the database and extract their names
    const collections = await client.db("p2").listCollections().toArray();
    const collectionNames = [];
    collections.forEach(ele => collectionNames.push(ele.name));
    // If the specified collection is present we serch for the query and return true if present
    // else it returns false
    if (collectionNames.includes(collection)) {
        let cursor = await client.db("p2").collection(collection).find().sort({_id:1}).limit(10).skip(skip);

        await cursor.forEach(doc => result.push(doc));

        if (result.length > 0) {
            return result;
        }

        return "No entries found";
    }
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => {client.close()}, 1500);
    }
}

// This functions returns all the entrys in a collection that matches the searchTerm in any field
async function serchAllFields(searchTerm) {
    let client;
    let result = [];

    try {
        client = await establishConnection();
        
        // This function call returns a cursor containing the searched entrys 
        let cursor =  client.db("p2").collection("events").find(
            {$or: [
                {orgName: {$regex: searchTerm, $options: "i"}},
                {orgCategory: {$regex: searchTerm, $options: "i"}},
                {eventTitle: {$regex: searchTerm, $options: "i"}},
                {eventHost: {$regex: searchTerm, $options: "i"}},
                {location: {$regex: searchTerm, $options: "i"}},
                {description: {$regex: searchTerm, $options: "i"}},
                {categories: {$regex: searchTerm, $options: "i"}}
            ]
        });
        await cursor.forEach(doc => result.push(doc));

        if (result.length > 0) {
            return result;
        }

        return "No entries found";
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

/* This is purely for testing purpose
async function main() {
    //const result = await insertEntry({fName: "Emma", lName: "smith", age: 16, gender: 1}, "userdb");
    //const result = await getEntry("Anna", "userdb");
    //const result = await serchAllFields("m");
    //const result = await getNewestEntries("events")
    
    //console.log(result);
}

main(); */
