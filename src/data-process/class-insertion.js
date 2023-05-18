// Import ES6 modules
import { getEntry, insertEntry, checkDuplicateLink } from '../database/databaseHandler.js';
import { accessEventsPage } from '../InformationGathering/url_processor.js';

// Export ES6 modules
export default {
    input_validation,
    date_conversion_formatting,
    time_until_event,
    format_address,
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
    if (input === undefined || input === null) {
        return false
    }

    if (expected === "str") {
        if (typeof input === "string") {
            return true;
        }
    } if (expected === "int") {
        if (typeof input === "number" || Number.isInteger(input)) {
            return true;
        }
    } if (expected === "bool") {
        if (typeof input === "boolean") {
            return true;
        }
    } if (expected === "obj") {
        if (typeof input === 'object') {
            return true;
        }
    }
    return false;
}

// Gets date from these 3 possible combinations of input
// 'TUESDAY, MAY 2, 2023 AT 5:30 PM – 7:00 PM UTC+02',
// 'WEDNESDAY, APRIL 26, 2023 AT 6:30 PM UTC+02',
// 'JUN 17 AT 4:00 PM – JUN 18 AT 2:00 AM UTC+02',
function date_conversion_formatting(date_str) {
    if (!input_validation(date_str, "str")) {
        return false;
    }

    // Different ways the date string can be formatted
    // - ^: Matches the start of a string
    // - .*?: Matches any character, "?" means optionally
    // - \d: Matches a digit (0-9)
    // - \w: Matches any word character (alphanumeric and underscore)
    // - {}, (): Quantifiers, i.e {1,2} = one or two digits, {4} precise 4 digits
    // - +: Matches next letter one or more time
    // - A-Z: Matches uppercase letter
    const formats = [
        { regex: /^(.*?), (.*?)( \d+)?, (\d{4}).*?$/, format: 'MMMM D, YYYY' },
        { regex: /^(.*?), (.*?)( \d+)?, (\d{4}) AT (\d+):(\d+) (AM|PM).*?$/, format: 'MMMM D, YYYY h:mm A' },
        { regex: /^(.*?), (\w{3}) (\d+).*?$/, format: 'MMM D, YYYY' },
        { regex: /^(\w{3}) (\d+) AT (\d+):(\d+).*?$/, format: 'MMM D, YYYY h:mm A' },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d+):(\d+).*?$/, format: 'MM/DD/YYYY h:mm A' }
    ];
    
    for (let i = 0; i < formats.length; i++) {
        // Tries to match with the regex's
        const match = date_str.match(formats[i].regex);
        // If found
        if (match) {
            // Format the match
            const dateStringFormatted = match.slice(1).join(' ').replace('AT', '').trim();
            let date = new Date(dateStringFormatted);
            // Plus one day. Apperantly JS counts from 0 in this case (so 1. Apri 2023) == (2023-04-00)
            date.setDate(date.getDate() + 1);
            // Checks if valid date. JS returns NaN (not a number) if date.getTime() isn't valid
            const isValid = !isNaN(date.getTime());
            if (isValid) {
                return date;
            }   
        }
    }
    // No matching date format
    return null;
}

// Gets duration from string
// String example:
// 'Duration: 1 hr 30 min' or
// 'Duration: 1 hr'
function get_duration(event_duration) {
    console.log(event_duration);
    if (!input_validation(event_duration, "str")) {
        return null;
    }
    // - i = flag for case sensitive. Lower and uppercase is the same
    // - (?:\s*(\d+)\s*(min))? = optional
    // - \s* = one or more spaces
    // - $ = end of string
    const regex = /^Duration:\s*(\d+)\s*(hr)(?:\s*(\d+)\s*(min))?$/i; // Good luck.
    // Gets the expression from event duration, [1] is hour and [3] is minutes (may not be present)
    const result_expression = event_duration.match(regex);
    let hours = result_expression[1];
    let minutes = 0;
    // Checks if there is minutes
    if (!isNaN(result_expression[3])) {
        minutes = result_expression[3];
        return `${hours} hours ${minutes} days(s)`;
    }
    return `${hours} hour(s)`;
}

// When event is happening relative to current time
function time_until_event(date) {
    if (!input_validation(date, "obj")) {
        return null;
    }

    const current_date = new Date();
    // getTime - gets time in milliseconds from your pc
    const difference_milliseconds = date.getTime() - current_date.getTime();
    return Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
}

// Formats string
function format_address(address) {
    // - g = All occurences
    return (((address.split(",")[0]).replace(/\d+/g, '')).trim()).toLowerCase(); 
}

// Determine if event are on campus
function on_campus(location) {
    if (!input_validation(location, "str")) {
        return false;
    }

    // Example adressess, expandable
    const campus_addresses = ["selmalagerløfsvej", 
                            "bertil ohlins vej", 
                            "frederik bajers vej",
                            "alfred obels vej",
                            "thomas manns vej",
                            "myrdalstræde", 
                            "pontoppidanstræde",
                            "Korghstræde"];

    // check if this.location is in campus_addresses
    if (campus_addresses.includes(format_address(location))) {
        return true;
    }
    return false;
}

function time_left_score(time_left) {
    // Input validation
    if (!input_validation(time_left, "obj")) {
        return null;
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
    // - ^ = negation
    return (string.replace(/[^a-zA-Z]/g, '')).toLowerCase();
}

function read_description(description) {
    if (!input_validation(description, "str")) {
        return null;
    }

    const categories = {
        'Festives': ["alcoholic", "alcoholics", "alkoholisk", "alkoholiske","beer","beers","øl","spirits", "spiritus", "bars", "bar", "barer", "booze", "sprit", "party", "parties", "fest", "fester"],
        'Career': ["job", "jobs", "arbejde", "career", "careers", "karriere", "karrierer", "interview", "interviews", "resume", "resumes", "CV", "promotion", "promotions", "forfremmelse", "forfremmelser", "salary", "salaries", "løn", "lønninger", "networking", "networking", "netværkning", "professional", "professionals", "professionel", "entrepreneurship", "entrepreneurship", "iværksætteri", "iværksætteri", "management", "management", "ledelse", "ledelse"],
        'Sports': ["tennis", "tennis", "fodbold", "fodbold", "basketball", "basketball", "baseball", "baseball", "cycling", "cykling", "volleyball", "volleybold", "swimming", "svømning"]
    };
    
    // Array with the description
    const tokens = description.split(" ");

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

    let found_categories = [];
    // Checks if the keywords in categories array is present in the description
    for (const category in categories) {
        let keywords = categories[category];
        for (const keyword of keywords) {
            if (tokens.includes(keyword) && !found_categories.includes(category)) {
                found_categories.push(category);
            }
        }
    }
    return found_categories;
}

class event_data {
    constructor(orgName, orgCategory, orgContactInfo, 
        eventLink, eventTitle, eventDate, 
        eventHosts, eventParticipants, eventLocation, 
        eventDuration, isPrivate, eventDescription, 
        eventTickets, eventImage) {
        this.orgName = orgName;
        this.orgCategory = orgCategory;
        this.orgContactInfo = orgContactInfo;
        this.eventLink = eventLink;
        this.eventTitle = eventTitle;
        this.eventHost = eventHosts;
        this.eventDate = date_conversion_formatting(eventDate);
        this.eventParticipants = eventParticipants;
        this.eventLocation = eventLocation;
        this.eventDuration = get_duration(eventDuration);
        this.isPrivate = isPrivate;
        this.eventDescription = eventDescription;
        this.timeLeft = time_until_event(this.eventDate);
        this.eventCategories = read_description(this.eventDescription);
        this.eventTickets = eventTickets;
        this.eventImage = eventImage;
        this.relevancyScore = this.final_score();
    }

    final_score() {
        // Basic score, maybe change later
        let basic_score = 0;

        if (on_campus(this.eventLocation)) {
            basic_score += high_score * 5;
        }
        if (time_left_score(this.time_left) !== null) {
            basic_score += time_left_score(this.time_left);
        }
        basic_score += this.eventParticipants;
        return basic_score;
    }
}

async function inserting_DB(event_class) {
    if (await checkDuplicateLink(event_class.eventLink, "events")) {
        return false;
    }
    await insertEntry(event_class, "events");
    return true;
}

async function main() {
    let event_arr = await accessEventsPage();
    let event_arr_size = event_arr.length;
    // Debug
    // console.log(`Array size: ${event_arr_size}`);
    // console.log(event_arr);

    // guard clause
    if (event_arr_size <= 0) {
        return false;
    }

    for (let i = 0; i < event_arr_size; i++) {
        const event_temp = new event_data(
            event_arr[i].orgName,
            event_arr[i].orgCategory,
            event_arr[i].orgContactInfo,
            event_arr[i].eventLink,
            event_arr[i].eventTitle,
            event_arr[i].eventDate,
            event_arr[i].eventHosts,
            event_arr[i].eventParticipants,
            event_arr[i].eventLocation,
            event_arr[i].eventDuration,
            event_arr[i].isPrivate,
            event_arr[i].eventDescription,
            event_arr[i].eventTickets,
            event_arr[i].eventImage
        )
        console.log(event_temp);
        // let a = await inserting_DB(event_temp);
        // if (a === false) {
        //     console.log("Event failed to insert");
        // }
        // else {
        //     console.log("Event inserted");
        //     console.log(event_temp);
        // }
    }

    return true;
}
