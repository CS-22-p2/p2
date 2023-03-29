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

class process_class {
    constructor(orgName, orgType,contactInfo, link, eventTitle, participants, location, event_date, duration, isPrivate, description){
        this.orgName = orgName;
        this.orgType = orgType;
        this.contactInfo = contactInfo;
        this.link = link;
        this.eventTitle = eventTitle;
        this.participants = participants;
        this.location = location;
        this.duration = duration;
        this.date = event_date;
        this.isPrivate = isPrivate;
        this.description = description;
    }
    
    read_description(string) {
        let words = string.split(this.description); // Transforms words into an array, where words are indexed

        for (let i = 0; i < length(words); i++){
            switch (words[i]) {
                case "alkohol":
                    if (words[i - 1].toLowerCase() === "ingen") {
                      console.log( "Der er ingen alkohol, så Johan ikke kommer")
                    } else {
                        console.log("Der er alkohol, Johan kommer")
                    }
                case ""    
            } 
        }
    }

    // When event is happening relative to current time
    // Can be frequently update with var_name.when_event() function
    when_event() {
        const event_date = new Date(this.event_date); // needs to be formatted as { 'yyyy-mm-dd' }
        const current_date = new Date();
        // getTime - gets time in milliseconds from your pc
        let difference_milliseconds = event_date.getTime() - current_date.getTime();
        return Math.ceil(difference_milliseconds / (1000 * 3600 * 24));
    }
}

event1 = process_class(date);


