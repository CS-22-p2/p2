// Imports
import { establishConnection } from "../database/databaseHandler.js";

// Exports

/* class user {
    constructor (userName, userPass) {
        this.userName = userName;
        this.userPass = userPass;
        this.favorittes = [];
        this.userId = getId();
    }
} */

async function getId() {
    let client;
    try {
        client = await establishConnection();

        const idNumber = await client.db("p2").collection("userdb").findOne({ids: {$gte: 0}});
        
        const result = idNumber.ids;
        // add one to current ids(largest id number currently), update in database and return the id.

        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function main() {
    const result = await getId();

    console.log(result);
}

main();