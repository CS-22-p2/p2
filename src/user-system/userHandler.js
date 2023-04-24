// Imports
import {user, getId} from "./user.js";
import { establishConnection, insertEntry} from "../database/databaseHandler.js";

// Exports
export { createUser, checkLogin }

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

async function checkLogin(body) {
    let client;
    try {
        client = await establishConnection();

        const result = await client.db("p2").collection("userdb").findOne({email: body.email});
        
        if (result.userPass == body.password){
            return true; // This needs to return user id instead, such that a cookie can be created  keeping the user logged in.
        }
        return false;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

const userData = { type: 'login', email: 'tmnj21@student.aau.dk', password: '123456789'};

async function main() {
    //await createUser(userData);
    const result = await checkLogin(userData)

    console.log(result);
}

main();