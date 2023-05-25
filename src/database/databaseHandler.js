// Imports
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import class_creator from '../data-process/class-insertion.js';

// Exports
export {
    insertEntry,
    update_existing_event,
    establishConnection,
    checkDuplicateLink,
    getNewestEntries,
    getAllEvents,
    updateFavorite,
    getFavorites,
    removeOutdatedEvents,
    getCategory
};

dotenv.config();
// This function connects to the specified mongo server and returns a client for use in other functions

async function establishConnection() {
    const uri = process.env.DATABASE_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
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
        // If the specified collection is present we insert the new entry and return true
        // else it returns false without inserting the new entry
        if (collectionNames.includes(collection)) {
            const result = await client.db("p2").collection(collection).insertOne(newEntry);
            console.log(`New entry created with the following id: ${result.insertedId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(error)
    } finally {
        await client.close();
    }
}

async function getNewestEntries(collection) {
    let client;
    let result = [];
    try {
    client = await establishConnection();

    // Get all the collections present in the database and extract their names
    const collections = await client.db("p2").listCollections().toArray();
    let collectionNames = [];
    collections.forEach(ele => collectionNames.push(ele.name));
    // If the specified collection is present we serch for the query and return true if present
    // else it returns false
    if (collectionNames.includes(collection)) {
        let cursor = await client.db("p2").collection(collection).find({ setup: { $exists: false } }).sort({_id: 1}); // add .limit if you want a specific amount of entries at a time

        await cursor.forEach(doc => result.push(doc));

        if (result.length > 0) {
            return result;
        }

        return "No entries found";
    }
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => {client.close()}, 1);
    }
}

// This functions returns all the entrys in a collection that matches the searchTerm in any field
async function searchAllFields(searchTerm) {
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

async function getAllEvents(collection) {
    let client;

    try {
        client = await establishConnection();
        const all_events = client.db("p2").collection(collection).find();
        if (all_events.length <= 0) {
            throw new Error("Database empty");
        }
        return all_events;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

// This function only works for the "events" collection
async function checkDuplicateLink(eventLink, collection) {
    let client;

    try {
        client = await establishConnection();

        const result = await client.db("p2").collection(collection).findOne({ eventLink: { $regex: eventLink } });

        if (result) {
            return true;
        }
        return false;

    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        //setTimeout(async () => {await client.close()}, 1);
    }
}

async function update_existing_event(eventClass, collection) {
    let client;

    try {
        client = await establishConnection();
        const results = await client.db("p2").collection(collection).findOne({ eventLink: { $regex: eventClass.eventLink } });
        if (results) {
            await client.db("p2").collection(collection).updateOne(
                { _id: results._id },
                {
                    $set: {
                        "eventTitle": eventClass.eventTitle,
                        "eventDate": eventClass.eventDate,
                        "eventParticipants": eventClass.eventParticipants,
                        "eventLocation": eventClass.eventLocation,
                        "eventDuration": eventClass.eventDuration,
                        "eventDescription": eventClass.eventDescription,
                        "timeLeft": eventClass.timeLeft,
                        "eventCategories": eventClass.eventCategories,
                        "eventTickets": eventClass.eventTickets,
                        "eventImage": eventClass.eventImage,
                        "relevancyScore": eventClass.relevancyScore
                    }
                }
            )
        }
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function updateFavorite(userId, eventId) {
    let client;

    try {
        client = await establishConnection();
        
        const result = await client.db("p2").collection("userdb").findOne({userId: userId});
        let favorittes = result.favorittes

        const duplicate = favorittes.includes(eventId);
        if (!duplicate) {
            // Addes the event id to the users list of favorites
            favorittes.push(eventId);
            const updateResult = await client.db("p2").collection("userdb").updateOne(
                {userId: userId}, 
                {$set: {favorittes: favorittes}});
            if (updateResult) {
                // favorittes updated
                return true;
            }
            // favorittes not updated
            return false;
        } else {
            // Removes the event id to the users list of favorites
            favorittes.splice(favorittes.indexOf(eventId), 1);
            const updateResult = await client.db("p2").collection("userdb").updateOne(
                {userId: userId}, 
                {$set: {favorittes: favorittes}});
            if (updateResult) {
                // favorittes updated
                return true;
            }
        }
        // event id is duplicate
        return false;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function getFavorites(userId) {
    let client;

    try {
        client = await establishConnection();

        const user = await client.db("p2").collection("userdb").findOne({userId: userId});
        if (user) {
            let favorites = [];
            user.favorittes.forEach((ele) => {favorites.push(new ObjectId(ele))});
            const favoriteEvents = await client.db("p2").collection("events").find({_id: {$in: favorites}}).toArray();
            //favoriteEventsCursor.forEach(ele => favoriteEvents.push(ele.name));
            if (favoriteEvents) {
                return favoriteEvents;
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function getCategory(category){
    let client;
    let result = [];
    try {
        client = await establishConnection();
        const cursor  = client.db("p2").collection("events").find({eventCategories: category});
        await cursor.forEach(doc => result.push(doc));
        if (result.length > 0) {
            return result;
        }
        return false;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function removeOutdatedEvents() {
    let client;

    try {
        client = await establishConnection();

        const result = await client.db("p2").collection("events").deleteMany({eventDate: {$lt: new Date(Date.now())}});
        console.log(result);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}
