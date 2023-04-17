import { user } from "./user.js";
import { insertEntry } from "../database/databaseHandler.js";

let button = document.getElementsByName("button");
console.log(button);
button[0].addEventListener("click", submit);

async function submit(){
    /* let newUser = new user(document.getElementsByName("name")[0].value,
                                                document.getElementsByName("lastName")[0].value,
                                                document.getElementsByName("mail")[0].value,
                                                document.getElementsByName("password")[0].value,
                                                document.getElementsByName("campus")[0].value)
    
    let result = insertEntry(newUser, "userdb");
    console.log(result); */ // This needs to be done on the backend not frontend ;(

    values += "name = " + document.getElementsByName("name")[0].value + "\n";
    values += "lastName = " + document.getElementsByName("lastName")[0].value + "\n";
    values += "mail = " + document.getElementsByName("mail")[0].value + "\n";
    values += "password = " + document.getElementsByName("password")[0].value + "\n";
    values += "campus = " + document.getElementsByName("campus")[0].value + "\n";
    alert(values);
    console.log(values);
}