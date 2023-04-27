// Imports
import { establishConnection, insertEntry } from "../database/databaseHandler.js";

// Exports
export {user, getId};

class user {
    constructor (firstName, lastName, email, userPass, campus, id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userPass = userPass;
        this.campus = campus;
        this.favorittes = [];
        this.userId = id;
    }
}

async function getId() {
    let client;
    try {
        client = await establishConnection();

        const idNumber = await client.db("p2").collection("userdb").findOne({ids: {$gte: 0}});
        
        const result = idNumber.ids + 1;
        // add one to current ids(largest id number currently), update in database and return the id.

        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

/* async function main() {
    const result = await getId();

    console.log(result);
}

main(); */