import { getNewestEntries } from "../database/databaseHandler.js";
export { get_sorted_events}

async function get_sorted_events(search_term) {
    // Input validation
    let possible_search_terms = ["eventDate", "relevancyScore", "eventCategories"];

    if (!possible_search_terms.includes(search_term)) {
        return false;
    }

    // Gets all events with the desired search term
    // if score or date, all events
    // Else categories
    let event_array = await getNewestEntries("events", 1);
    let event_array_index = [];
    let unsortable = [];

    // Adds events with sortable values to event_array_index
    for (let i = 0; i < event_array.length; i++) {
        if (event_array[i][search_term] === undefined ||
            event_array[i][search_term] === false ||
            event_array[i][search_term] === null) {
            let obj = { index: i, value: event_array[i][search_term] }
            unsortable.push(obj);

        } else {
            let obj = { index: i, value: event_array[i][search_term] }
            event_array_index.push(obj);
        }
    }
  
    // Returns index array of how the sorted list should be
    event_array_index = InsertionSort(event_array_index);

    let sorted_list = [];
    // Gets the original object and inserts it with the index arrat
    for (let i = 0; i < event_array_index.length; i++) {
        sorted_list[i] = event_array[event_array_index[i].index];
    }

    // Reverse if highest from lowest is needed
    if (search_term !== "eventDate") {
        sorted_list = sorted_list.reverse();
    }

    // Adds the unsortable data to the array
    for (let i = 0; i < unsortable.length; i++) {
        sorted_list.push(event_array[unsortable[i].index]);
    }

    // Returns an array with sorted event objects
    return sorted_list;
}

// Used to sort events by date or by relevancy score
// Works "in place" so we do not need to return array from function
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
