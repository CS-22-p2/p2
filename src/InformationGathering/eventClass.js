export class Event {
  constructor(orgName, orgType, orgContactInfo, 
              eventLink, eventTitle, eventDate, 
              eventHosts, eventParticipants, eventLocation, 
              eventDuration, isPrivate, eventDescription, 
              eventTickets, eventImage) {
    this.orgName = orgName;
    this.orgType = orgType;
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
