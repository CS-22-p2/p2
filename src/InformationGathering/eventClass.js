//This is the event class the entirety of the implemented program makes use of

export class Event {
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
    this.eventDate = eventDate;
    this.eventHosts = eventHosts;
    this.eventParticipants = eventParticipants;
    this.eventLocation = eventLocation;
    this.eventDuration = eventDuration;
    this.isPrivate = isPrivate;
    this.eventDescription = eventDescription;
    this.eventTickets = eventTickets;
    this.eventImage = eventImage;
  }
}
