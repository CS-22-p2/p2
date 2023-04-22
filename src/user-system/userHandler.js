// Imports
import {user, getId} from "./user.js";
import { establishConnection, insertEntry } from "../database/databaseHandler.js";

// Exports
export { createUser }

async function createUser(userData) {
    const idNumber = await getId();

    /* 
    There should be some kind of input validation here
    checking if email looks like an email and so on.
    Furthermore this is where the password should be 
    salted and encrypted.
    */
    let newUser = new user(
        userData.name, 
        userData.lastName, 
        userData.email,
        userData.password, 
        userData.campus,
        idNumber
    );
    console.log(newUser);

    const result = await checkForDuplicates(newUser);

    if (result == null) {
        await insertEntry(newUser, "userdb");
        return true;
    }

    return false;
}

async function checkForDuplicates(newUser) {
    let client;
    try {
        client = await establishConnection();

        const result = await client.db("p2").collection("userdb").findOne({email: newUser.email});
        
        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

/* const userData = {
    type: 'signUp',
    name: 'Theis',
    lastName: 'Jensen',
    email: 'tmnj21@student.aau.dk',
    password: '123456789',
    campus: 'AAU Aalborg SØ'
};

async function main() {
    await createUser(userData);
}

main(); */