export {
    eventCheck,
    checkFb,
    logEvents,
    processInformation,
}

// false = page has NO upcoming events
// true = page has upcomming events
function eventCheck(string){
    if (typeof string !== "string") return false

    return string !== "No events to show";
}

//Checks if facebook link, and appends necessary path
function checkFb(orgURL){
    if (typeof orgURL !== "string") return "Unknown"
  
    let eventPageURL = orgURL;
    
    //Checks if the URL is a link to facebook
    if(orgURL.includes("facebook"))
    {
        //Some URL's have a trailing / which we need to take into account
        if(orgURL.at(-1) === "/")
        {
            eventPageURL += "upcoming_hosted_events";
        }else{
            eventPageURL += "/upcoming_hosted_events";
        }
    }else
    {
        eventPageURL = "Unknown"; //The URL is not a link to a facebook page
    }
    return eventPageURL; //Return processed URL
}

//Used for debugging and overview of collected links
function logEvents(orgData)
{
    for(let org of orgData)
    {
        console.log(org.destinationURL);
    }
}

/**
 * processInformation processes the raw event data from the facebook page and stores them in an event object
 * The description comes as an array of strings -> Converted into one long string
 * Participants are collected as strings -> Converted into integer
 * Details also come as an array of strings -> Extract duration and if an event is private
 * @param {"The raw data from the facebook event page"} gatheredData 
 * @returns "Event Object, with all the relevant information from the event-class model"
 */
function processInformation(gatheredData)
{
  let event_data = new Event();
  let description = gatheredData.eventDescriptionStart + " ";

  //Some fields can just be stored directly without any processing
  event_data.eventLink = gatheredData.eventLink;
  event_data.eventTitle = gatheredData.eventTitle;
  event_data.eventDate = gatheredData.eventDate;
  event_data.eventHosts = gatheredData.eventHosts;
  event_data.eventLocation = gatheredData.eventLocation;
  event_data.eventTickets = gatheredData.eventTickets;
  event_data.eventImage = gatheredData.eventImage;
  
  //Converting participants from string to integer
  event_data.eventParticipants = parseInt(gatheredData.eventParticipants);

  //Processing details. Since details is an array of strings
  for(let element of gatheredData.eventDetails)
  {
    if(element.includes("Duration:") || element.includes("days") || (element.includes("hr")) && (element.includes("min"))){
      event_data.eventDuration = element;
    }else if(element.includes("Public"))
    {
      event_data.isPrivate = false;
    }else if(element.includes("Private")){
      event_data.isPrivate = true;
    }
  }
 
 //Processing Event Description
 for(let element of gatheredData.eventDescription)
 {
  description += element; //Append each part of description into one long string
  description += " "; //Spaces are nice too
 }
 description = description.replace("See less",""); //Removes unwanted string("See less")
 event_data.eventDescription = description;

 return event_data; 
}