import { log } from "console";
import {date_conversion_formatting} from "./event-insertion.js";
import { type } from "os";
import { test } from "node:test";


//--------------JUST USED FOR TESTING----------------------
/*
const testDates = [
    "WEDNESDAY, 26 APRIL 2023 AT 18:30 UTC+02",
    "17 JUN AT 16:00 – 18 JUN AT 02:00 UTC+02",
    "THURSDAY, 27 APRIL 2023 AT 17:15 UTC+02",
    "TUESDAY, 2 MAY 2023 FROM 18:30-00:00 UTC+02",
    "SATURDAY, 29 APRIL 2023 AT 17:00 UTC+02",
    "TUESDAY, 2 MAY 2023 FROM 18:30-00:00 UTC+02",
    "TUESDAY, 2 MAY 2023 FROM 18:30-00:00 UTC+02",
    "SATURDAY, 13 MAY 2023 FROM 13:00-18:00 UTC+02",
    "TUESDAY, 2 MAY 2023 FROM 17:30-19:00 UTC+02",
    "WEDNESDAY, 3 MAY 2023 AT 16:00 UTC+02",
    "TUESDAY, 30 MAY 2023 FROM 17:30-19:00 UTC+02",
    "WEDNESDAY, 31 MAY 2023 FROM 13:00-16:00 UTC+02",
    "SUNDAY, 23 APRIL 2023 AT 10:30 UTC+02",
    "FRIDAY, 12 MAY 2023 AT 22:00 UTC+02",
    "FRIDAY, 28 APRIL 2023 AT 16:30 UTC+02",
    "FRIDAY, 28 APRIL 2023 FROM 12:30-23:00 UTC+02",
    "WEDNESDAY, 17 MAY 2023 FROM 17:00-01:00 UTC+02",
    "FRIDAY, 5 MAY 2023 FROM 16:00-22:00 UTC+02",
    "MONDAY, 24 APRIL 2023 AT 16:00 UTC+02",
    "trolo trolo tolllol trolloolo trlolo",
    "MONDAY, 15 MAY 2023 AT 16:00 UTC+02",
    "TUESDAY, 25 APRIL 2023 FROM 16:30-18:00 UTC+02",
    "TUESDAY, 16 MAY 2023 FROM 17:00-20:00 UTC+02",
    "MONDAY, 15 MAY 2023 AT 17:30 UTC+02",
    "FRIDAY, 12 MAY 2023 AT 14:15 UTC+02",
    "FRIDAY, 2 JUNE 2023 AT 14:15 UTC+02",
    "FRIDAY, 30 JUNE 2023 AT 17:00 UTC+02"
]

function setTestDates(testDates)
{
    let processedDateArray = [];

    for(let date of testDates)
    {
        processedDateArray.push(date_conversion_formatting(date));
    }

    return processedDateArray;
}
*/
//-----------------------------------------------------------------


//Used to sort events by date or by relevancy score
//Works "in place" so we do not need to return array from function
function InsertionSort(array)
{
    //Checks if the dates are valid and corrects array if invalid dates occur
    let invalidIndexes = invalidDateChecker(array); 

    //Insertion Sort --- See CLRS ch. 2.1
    for(let j = 1; j < array.length; j++)
    {
        let key = array[j];
        let i = j - 1;
        while(i >= 0 && array[i] > key)
        {
            array[i + 1] = array[i]
            i = i - 1;
        }
        array[i + 1]=key;
    }
    return invalidIndexes;
}

function invalidDateChecker(array){
    let invalidIndexes = [];

    //Check if an invalid date is passed into the array
    for(let element in array)
    {
        if(array[element].toString() === "Invalid Date") //If an invalid date is passed it is removed form the array
        {
            invalidIndexes.push(parseInt(element)); //Store invalid index for later use
            array.splice(element, 1)
        }
    }
    return invalidIndexes;
}

//-------Executed Commands-----
/*
let eventDates = setTestDates(testDates);
console.log(eventDates);
let check = InsertionSort(eventDates);
console.log(eventDates);
console.log(check);
let testNumbers = [100,10,5,17,20,9,0,-3,28,3,1,77];
console.log(testNumbers);
InsertionSort(testNumbers);
console.log(testNumbers);
*/
//------------------------------

