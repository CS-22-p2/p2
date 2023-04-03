// Input from webcrawler will look like
class Event {
    constructor(orgName, orgType,contactInfo, link, eventTitle, participants, location, duration, isPrivate, description) {
      this.orgName = orgName;
      this.orgType = orgType;
      this.contactInfo = contactInfo;
      this.link = link;
      this.eventTitle = eventTitle;
      this.participants = participants;
      this.location = location;
      this.duration = duration;
      this.isPrivate = isPrivate;
      this.description = description; 
    }
}


// When event is happening relative to current time
// Can be frequently update with var_name.when_event() function
function when_event(date) {
    const event_date = new Date(date); // needs to be formatted as { 'yyyy-mm-dd' }
    const current_date = new Date();

    // getTime - gets time in milliseconds from your pc
    let difference_milliseconds = event_date.getTime() - current_date.getTime();
    return Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
}

// Formats string
function format_string(string) {
    return ((string.replace(/\d+/g, '')).trim()).toLowerCase();
}

class relevancy_score {
    constructor(location, participants, date) {
        this.location = location;
        this.participants = participants;
        this.date = date;
        this.time_left = when_event(date);

        this.irellevant_number = 0;
        this.base_number = 100;
        this.relevant_number = 200;
    }

    update() {
        return [this.time_left_score(), this.participants]
    }

    score() {
        // Basic score, maybe change later
        let a = 0;
        let b = 0;
        if (this.on_campus()) {
            a = this.relevant_number;
        }
        if (this.repeated_events()) {
            b = this.relevant_number;
        }
        return [a, b, this.time_left_score(), this.participants]
    }

    // Determine if event are repeated
    repeated_events() {
        // Check DB if there's prior events, with matching 
    }

    // Determine if event are on campus
    on_campus() {
        // Example
        let campus_addresses = ["selmalagerløfsvej", "bertil ohtils vej", "frederik bajers vej"];
        let check_location = format_string(this.location);

        // check if this.location is in campus_addresses
        if (campus_addresses.includes(check_location)) {
            return true
        }
        else {
            return false
        }
    }

    // Calculate a weight for time_left
    time_left_score() {
        // Old event, already happened. Edge case
        if (this.time_left < 0) {
            return this.irellevant_number;
        }
        // If there's a over a month left
        else if (this.time_left > 30) {
            return this.base_number;
        }
        // More than two weeks, less than 1 month
        else if (this.time_left >= 14 && this.time_left <= 30 ) {
            return this.base_number * 1.5;
        }
        // less than 2 weeks
        return this.relevant_number;
    }
}

// How to make an event
const an_event = new relevancy_score("Selmalagerløfsvej", 112, '2023-04-15');
