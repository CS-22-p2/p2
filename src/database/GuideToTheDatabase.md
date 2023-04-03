# Guide to the database
## The functions
* insertEntry(newEntry, collection)
* getEntry(query, collection)
* serchAllFields(searchTerm)

When ever you want to use the database to store or retrive anything you can do so in the following way:
```js
import { insertEntry, getEntry } from '../database/databaseHandler.js'

const result = await insertEntry({fName: "Emma", lName: "smith", age: 16, gender: 1}, "userdb"); // this inserts a entry(user)
const result = await getEntry("Anna", "userdb"); // This finds a entry in the userdb collection with fName  equal to Anna
const result = await serchAllFields('Anna'); // This returns every entry in userdb matching searchTerm (to be updated)
```
These calls of the functions have to be within a async function, as these functions are asyncronus.
```js
async function yourFunction() {
    const result = await getEntry("Anna", "userdb");

    console.log(result);
}
```
When working with the database it can be useful to save the collection you are going to use (most likely eventdb) like so:
```js
const collection = "eventdb";
```
this can then be used like this:
```js
const result = await getEntry("Anna", collection);
```

This concludes "Guide to the database" as og 31-03-2023.