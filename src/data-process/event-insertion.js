// Import
import { getEntry, insertEntry } from '../database/databaseHandler.js';
import { accessEventsPage } from '../InformationGathering/url_processor.js';

// Export
export default {
    input_validation,
    date_conversion_formatting,
    get_duration,
    time_until_event,
    format_address,
    repeated_events,
    on_campus,
    time_left_score,
    strip_and_trim,
    read_description
};

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

// Converts eventdate into useable data
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

    return new Date(`${r_year}-${r_month}-${r_day}`);
}

function date_conversion_formatting_multiple_days(date_str) {
    const date_str_split = date_str.split(" ");
    const date_part = {
        day: date_str_split[0],
        month: date_str_split[1],
        year: 2023
    };
    const the_months = {
        JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
        JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
        JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
        JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12
    };
    const r_month = String(the_months[date_part.month.toUpperCase()]).padStart(2, '0');
    const r_day = date_part.day.padStart(2, "0");
    const r_year = date_part.year;

    return new Date(`${r_year}-${r_month}-${r_day}`);
}

function determine_event_date_type(date_str) {
    let first_element = date_str.split(" ")[0];
    if (!isNaN(Number(first_element))) {
        return date_conversion_formatting_multiple_days(date_str);
    }

    return date_conversion_formatting(date_str);
}

function get_duration(date_str) {
    // This is illegal, don't look
    const date_str_split = date_str.split(" "); // Splits at ' '
    const duration_str = date_str_split[5]; // Element that contains 10:00-15:00
    const start = parseInt(duration_str.split('-')[0].replace(':', '')); // splits at -, and remove :, so 10:00 becomes 1000
    const end = parseInt(duration_str.split('-')[1].replace(':', ''));
    const difference = end - start;
    const hours = Math.floor(difference / 100); 
    const minutes = difference - (hours * 100);
    return `${hours} hour(s) and ${minutes} minutes`; // Returns string, only for visual
}

// When event is happening relative to current time
function time_until_event(date) {
    const current_date = new Date();

    // getTime - gets time in milliseconds from your pc
    const difference_milliseconds = date.getTime() - current_date.getTime();
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
    const campus_addresses = ["selmalagerløfsvej", 
                            "bertil ohtils vej", 
                            "frederik bajers vej"];

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

function strip_and_trim(string) {
    return (string.replace(/[^a-zA-Z]/g, '')).toLowerCase();
}

function read_description(description) {
    const tokens = description.split(" ");
    let found_categories = [];
    const categories = {
        'alcohol-free': ['nonalcoholic', 'sober', 'drugfree',"spirtis","bars","booze","party"
                        ,"alkoholfri","ædru","stoffri","spiritus","barer","alkohol","fest" ],
        'business': ['career', 'networking', 'professional', 'entrepreneurship',"management", "jobs", "job",
                    ,"karriere","netværk","professionel","iværksætteri","ledelse"],
        'sport':    ['tennis', "football", "basketball", "baseball", "cycling", "volleyball", "swimming"
                    ,"tennis", "fodbold", "basketball", "baseball", "cykling", "volleybold", "svømning"]
    };
    
    // strips and trims array
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = strip_and_trim(tokens[i]);
    }

    // Remove generic words
    const removeable_words = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'person', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i] === '' || removeable_words.includes(tokens[i])) {
            tokens.splice(i, 1);
        }
    }

    for (const category in categories) {
        let keywords = categories[category];
        for (const keyword of keywords) {
            if (tokens.includes(keyword)) {
                found_categories.push(category);
            }
        }
    }    
    return found_categories;
}

class event_data {
    constructor(orgName, orgType, contactInfo, link, eventTitle, eventDate, participants, location, duration, isPrivate, description) {
        this.orgName = orgName;
        this.orgType = orgType;
        this.contactInfo = contactInfo;
        this.link = link;
        this.eventTitle = eventTitle;
        this.date = determine_event_date_type(eventDate);
        this.participants = participants;
        this.location = location;
        this.duration = get_duration(eventDate);
        this.isPrivate = isPrivate;
        this.description = description;
        this.time_left = time_until_event(this.date);
        this.relevancy_score = this.final_score();
        this.categories = read_description(this.description);
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

// Look if event already in DB. 
async function check_duplicate_event(event_instance) {
    const query = { link: event_instance.link };

    const result = await getEntry(query, "events");
    return result; // getEntry returns true if found, else false
}

async function inserting_DB(event_instance) {
    // If it's duplicate, returns false. Do nothing
    if (check_duplicate_event(event_instance)) {
        if (!check_repeated_events(event_instance)) {
            return false;
        }
        else {
        }
    }

    // Inserting event into MongoDB. Needs testing.
    await insertEntry(event_instance, "events");
    return true;
}

async function main() {
    console.log(accessEventsPage());
}

main()
