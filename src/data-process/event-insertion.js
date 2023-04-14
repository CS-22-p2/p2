// Import

const { throws } = require("assert");

// Global variables
let base_score = 100;
let high_score = 200;

// When event is happening relative to current time
function when_event(date) {
    const event_date = new Date(date); // needs to be formatted as { 'yyyy-mm-dd' }
    const current_date = new Date();

    // getTime - gets time in milliseconds from your pc
    let difference_milliseconds = event_date.getTime() - current_date.getTime();
    return Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
}

// Formats string
function format_address(address) {
    // Input validation
    if (address === null || 
        address === undefined ||
        typeof address === 'string') {
        throw new Error('Wrong input given');
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
    if (location === null || 
        location === undefined ||
        typeof location === 'string') {
        throw new Error('Wrong input given');
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
    if (time_left === null || 
        time_left === undefined ||
        Number.isInteger(time_left)) {
        throw new Error('Wrong input given');
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
    else if (time_left >= 14 && time_left <= 30 ) {
        return base_score * 1.5;
    }
    // less than 2 weeks
    return high_score;
}

class evnet_insert {
    constructor(orgName, orgType,contactInfo, link, eventTitle, eventDate, participants, location, duration, isPrivate, description) {
        this.orgName = orgName;
        this.orgType = orgType;
        this.contactInfo = contactInfo;
        this.link = link;
        this.eventTitle = eventTitle;
        this.date = eventDate;
        this.participants = participants;
        this.location = location;
        this.duration = duration;
        this.isPrivate = isPrivate;
        this.description = description;
        this.time_left = when_event(this.date);
        this.relevancy_score = this.final_score();
    }

    final_score() {
        // Basic score, maybe change later
        let a = 0;
        let b = 0;
        if (on_campus(this.location)) {
            a = high_score;
        }
        if (this.repeated_events()) {
            b = -base_score; // Minus points if repeated events
        }
        return (a + b + time_left_score(this.time_left) + this.participants);
    }

    // Insert into DB
    // Theissssss
}

// How to make an event
const an_event = new evnet_insert(// Arguments
                                                );


// Export
exports.format_address = format_address;
exports.when_event = when_event;

