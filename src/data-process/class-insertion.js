// Import ES6 modules
import { insertEntry, checkDuplicateLink, update_existing_event } from '../database/databaseHandler.js';
import { accessEventsPage } from    '../InformationGathering/url_processor.js';

import {
    input_validation,
    date_conversion_formatting,
    time_until_event,
    on_campus,
    time_left_score,
    read_description,
} from "./data-process-utils.js"

// Export ES6 modules
export default {
    class_creator
};

// Global variables
let base_score = 100;
let high_score = 200;

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
        if (input_validation(time_left_score(this.time_left), "int")) {
            basic_score += time_left_score(this.time_left);
        }
        basic_score += this.eventParticipants;
        return basic_score;
    }
}

async function inserting_DB(event_class) {
    try {
        // checks for duplicate
        const duplicate = await checkDuplicateLink(event_class.eventLink, "events");
        if (duplicate) {
            // Updates existing entry
            const changes = await update_existing_event(event_class, "events");
            if (changes) {
                return true;
            }
            // Something went wrong
            throw new Error("Couldn't update event");
        }
        // If not duplicate, insert entry
        const result = await insertEntry(event_class, "events");
        if (!result) {
            throw new Error("Couldn't insert event");
        }
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function class_creator() {
    let event_arr;
    try {
        event_arr = await accessEventsPage();
        if (event_arr.length <= 0) {
            throw new Error("Couldn't get array from webcrawler");
        }
    } catch (error) {
        console.error(error);
        return false;
    }

    for (let i = 0; i < event_arr.length; i++) {
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
        );
        await inserting_DB(event_temp);
    }
    return true;
}
