import puppeteer from "puppeteer";
import {getElement, getElementsArray} from "./web_crawler.js";
import {scrapeOrgData, scrape, DeleteFirstPage} from "./org_crawler.js";
import { Event } from "./eventClass.js";
import { assignEventScrapeWorkers } from "./scrape_worker_main.js";

import {
    eventCheck,
    checkFb,
    logEvents,
    processInformation,
} from "./information-gathering-utils.js"

export {accessEventsPage};

//The classes of the HTML elements we want to read from the DOM - Facebook Organisation Page
const no_event_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x41vudc.x1603h9y.x1u7k74.x1xlr1w8.x12scifz.x2b8uid";
const event_link_class = "a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.x1s688f"; 

//---------------EXECUTED COMMANDS--------------

//eventList will hold an array of instances of the eventClass, which are later stored in the database
//let eventList = await accessEventsPage();
//console.log(eventList);
//console.log(eventList.length);
//--------------------------------------------------------

/**
 * Enters each Facebook group/organisation -> Checks for upcomming events
 * If found: Scrapes all the events(by calling processEvents) and stores them in eventList
 * Not found: Moves onto the next organisation
 * @param {"The object containing all the Organisation URLs, but also orgName and orgCategory"} orgData 
 * @returns an array of eventClass objects
 */
async function accessEventsPage()
{
    // Collects the organisations Web-page URLs
    const orgData = await scrapeOrgData(scrape);
    logEvents(orgData);

    //Launches an empty browser
    const browser = await puppeteer.launch({
        headless: true, //Headless = "true": We do not want to see all the processing in the browser (set to "false" for easier debugging)
        defaultViewport: null, //We do not set a specific viewport(Size of the window)
        args: ['--lang=en-GB,en'] //Browser language is set to English(Consistency, as some users might have different languages set in the browser)
    });

    let eventList = []; // This array holds the events we want to export
    let eventLinks; // Will hold the links to the event pages(array)

    //Create a page handler, which will be used to acess all the necessary sites
    const page = await browser.newPage();
    DeleteFirstPage(browser)

    //Again force the language to be English
    page.setExtraHTTPHeaders({
        "Accept-Language": "en",
    })

    //Loops over all of the organisation URLs
    for(let org of orgData){
        //If URL is to a facebook group -> Appends path string "/upcoming_hosted_events"
        //Otherwise: fbURL is set to "Unknown"
        let fbURL = checkFb(org.destinationURL);
        
        if(fbURL !== "Unknown")
        {
            //Enter event overview page for the organisation
            await page.goto(fbURL, {
            waitUntil: "networkidle2",
            });

            //If we try to go to https://www.facebook.com/someorganisation/upcoming_hosted_events
            //The element called "no_event_class" will have the value of "No events to show" if the are no upcomming events
            let check_value = await getElement(page, no_event_class, "innerHTML");

            if(eventCheck(check_value))
            {
                //Extracts all links from the organisation event overview page
                eventLinks =  await getElementsArray(page, event_link_class, "href");
                let collectedEvents = await processEvents(eventLinks, org); //Scrapes event pages
                eventList = eventList.concat(collectedEvents); //Append the collected events to eventList
            }else eventLinks = "None";
        }
    }
    await browser.close(); //Close the browser
    return eventList; //Return collected events
}

/**
 * 
 * @param {"Links to the events hosted by the given organisation"} eventLinks
 * @param {"Page handler"} page 
 * @param {"Contains the necessary information for the given organisation"} org 
 * @returns "All the events associated with the given organisation on facebook"
 */
async function processEvents(eventLinks, org)
{
    let eventsArray = []; //Holds the colled events
    let noDuplicateLinks = await removeDuplicate(eventLinks);
    // Get event data from workers
    let unProcessedData;
    await assignEventScrapeWorkers(noDuplicateLinks).then((data) => unProcessedData = data)

    for (let data of unProcessedData)
    {
        let processedData = processInformation(data);
        processedData.orgName = org.name;
        processedData.orgCategory = org.category;
        processedData.orgContactInfo = org.contactInfo;
        eventsArray.push(processedData); //Store the event in the event array
    }
    return eventsArray;
}

async function removeDuplicate(eventLinks)
{
    let noDuplicateArray = [];
    for(let link of eventLinks)
    {
        //Event links that contain queries are just duplicate from the same organisation
        if( !(link.includes("?")) ){
            noDuplicateArray.push(link);
        }
    }
    return noDuplicateArray;
}