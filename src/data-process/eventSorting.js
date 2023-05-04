// import {date_conversion_formatting} from "./event-insertion.js";
// import { type } from "os";
// import { test } from "node:test";
import { insertEntry, searchAllFields } from "../database/databaseHandler.js";


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


async function get_sorted_events(search_term) {
    // Input validation
    let possible_search_terms = ["date", "relevancy_score"];
    if (!possible_search_terms.includes(search_term)) {
        return false;
    }

    let event_array = await searchAllFields(search_term);
    // let event_array = [
    //     {date: null, relevancy_score: 11},
    //     {date: 13, relevancy_score: 13},
    //     {date: 12, relevancy_score: 12},
    //     {date: 10, relevancy_score: 10},
    // ];

    let event_array_index = [];
    let unsortable = [];

    for (let i = 0; i < event_array.length; i++) {
        if (event_array[i][search_term] === undefined ||
            event_array[i][search_term] === false ||
            event_array[i][search_term] === null) {
                let obj = {index: i, value: event_array[i][search_term]}
                unsortable.push(obj);

        } else {
            let obj = {index: i, value: event_array[i][search_term]}
            event_array_index.push(obj);
        }
    }
    event_array_index = InsertionSort(event_array_index);

    let sorted_list = [];

    for (let i = 0; i < event_array_index.length; i++) {
        sorted_list[i] = event_array[event_array_index[i].index];
    }
    if (search_term === "relevancy_score") {
        sorted_list = sorted_list.reverse();
    }
    for (let i = 0; i < unsortable.length; i++) {
        sorted_list.push(event_array[unsortable[i].index]);
    }
    console.log(sorted_list);
}
get_sorted_events("date");


//Used to sort events by date or by relevancy score
//Works "in place" so we do not need to return array from function
function InsertionSort(array) {
    //Insertion Sort --- See CLRS ch. 2.1
    for (let j = 1; j < array.length; j++) {
        let key = array[j];
        let i = j - 1;
        while (i >= 0 && array[i].value > key.value) {
            array[i + 1] = array[i]
            i = i - 1;
        }
        array[i + 1] = key;
    }
    return array;
}
