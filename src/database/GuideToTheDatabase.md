# Guide to the database
## The functions
* insertEntry(newEntry, collection)
* getEntry(query, collection)

When ever you want to use the database to store or retrive anything you can do so in the following way:
```js
import { insertEntry, getEntry } from '../database/database-main.js'

const result = insertEntry({fName: "Emma", lName: "smith", age: 16, gender: 1}, "userdb"); // this inserts a entry(user)
const result = getEntry("Anna", "userdb"); // This finds a entry in the userdb collection with fName  equal to Anna
```
These calls of the functions might need to be within a async function, as these functions are asyncronus.This will be tested furthor and updated once the database is needed.

When working with the database it can be useful to save the collection you are going to use (most likely eventdb) like so:
```js
const collection = "eventdb";
```
this can then be used like this:
```js
const result = getEntry("Anna", collection);
```

This concludes "Guide to the database" as og 30-03-2023.