// Import
import { getEntry, insertEntry } from '../database/databaseHandler.js';

// Global variables
let base_score = 100;
let high_score = 200;

// Checks if input is of the expected type. Returns true if correct
function input_validation(input, expected) {
    // Guard clause
    if (expected === "str") {
        if (typeof input !== "string" || input === null || input === undefined) {
            return false;
        }
    } if (expected === "int") {
        if (typeof input !== "number" || !Number.isInteger(input)) {
            return false;
        }
    } if (expected === "bool") {
        if (typeof input !== "boolean") {
            return false;
        }
    }

    return true; // Correct input
}

// Converts eventdate into usuable data
function date_conversion_formatting(date_str) {
    const date_str_split = date_str.split(" ");
    const date_part = {
        day: date_str_split[1],
        month: date_str_split[2],
        year: date_str_split[3]
    };
    // The months abbreviated and full. Works like a dict
    const the_months = {
        JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
        JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
        JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
        JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12
    };
    const r_month = String(the_months[date_part.month.toUpperCase()]).padStart(2, '0');
    const r_day = date_part.day.padStart(2, "0");
    const r_year = date_part.year;
    return `${r_year}-${r_month}-${r_day}`;
}

// When event is happening relative to current time
function time_until_event(date) {
    const event_date = new Date(date); // needs to be formatted as { 'yyyy-mm-dd' }
    const current_date = new Date();

    // getTime - gets time in milliseconds from your pc
    let difference_milliseconds = event_date.getTime() - current_date.getTime();
    return Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
}

// Formats string
function format_address(address) {
    // Input validation
    if (!input_validation(address, "str")) {
        throw new Error("Wrong input");
    }

    return ((address.replace(/\d+/g, '')).trim()).toLowerCase(); // Regex
}

// Determine if event are repeated
function repeated_events() {
    // Check DB if there's prior events, with matching 
}

// Determine if event are on campus
function on_campus(location) {
    // Input validation
    if (!input_validation(location, "str")) {
        throw new Error("Wrong input");
    }

    // Example adressess
    let campus_addresses = ["selmalagerløfsvej", "bertil ohtils vej", "frederik bajers vej"];

    // check if this.location is in campus_addresses
    if (campus_addresses.includes(format_address(location))) {
        return true;
    }
    return false;
}

function time_left_score(time_left) {
    // Input validation
    if (!input_validation(time_left, "int")) {
        throw new Error("Wrong input");
    }

    // Old event, already happened. Edge case
    if (time_left < 0) {
        return -1000;
    }
    // If there's a over a month left
    else if (time_left > 30) {
        return base_score;
    }
    // More than two weeks, less than 1 month
    else if (time_left >= 14 && time_left <= 30) {
        return base_score * 1.5;
    }
    // less than 2 weeks
    return high_score;
}

class event_data {
    constructor(orgName, orgType, contactInfo, link, eventTitle, eventDate, participants, location, duration, isPrivate, description) {
        this.orgName = orgName;
        this.orgType = orgType;
        this.contactInfo = contactInfo;
        this.link = link;
        this.eventTitle = eventTitle;
        this.date = date_conversion_formatting(eventDate);
        this.participants = participants;
        this.location = location;
        this.duration = duration;
        this.isPrivate = isPrivate;
        this.description = description;
        this.time_left = time_until_event(this.date);
        this.relevancy_score = this.final_score();
    }

    final_score() {
        // Basic score, maybe change later
        let a = 0;
        let b = 0;
        if (on_campus(this.location)) {
            a = high_score;
        }
        return (a + b + time_left_score(this.time_left) + this.participants);
    }
}

// How to insert an event into the database

// Create an instance


// Look if event already in DB
async function check_duplicate_event(event_instance) {
    const query = { link: event_instance.link };

    const result = await getEntry(query, "events");
    return result; // getEntry returns true if found, else false
}

async function inserting_DB(event_instance) {
    // If it's duplicate, returns false. Do nothing
    // if (check_duplicate_event(event_instance)) {
    //     if (!check_repeated_events(event_instance)) {
    //         return false;
    //     }
    //     else {
    //     }
    // }

    // Instance to JSON stirng. Samy as object, just mutuable
    // const event_JSON_stirng = JSON.stringify(event_instance);

    // Inserting event into MongoDB. Needs testing.
    await insertEntry(event_instance, "events");
    return true;
}

// Export
export default {
    input_validation,
    date_conversion_formatting,
    time_until_event,
    format_address,
    repeated_events,
    on_campus,
    time_left_score,
    event_data
};


async function main() {
    const event_instance = new event_data("Org name", "Event type", "Contact info", "link", "Event title", "WEDNESDAY, 19 APRIL 2023 FROM 15:00-16:30 UTC+02", 112, "selmalagerløgsvej 12", "Duration", true, "Description");
    await inserting_DB(event_instance);
}

main();
