import puppeteer from "puppeteer";
import {getData, processInformation, getElement, getElementsArray} from "./web_crawler.js";
import {scrapeOrgData, scrape} from "./org_crawler.js";
import { Event } from "./eventClass.js";
import { assignEventScrapeWorkers } from "./scrape_worker_main.js";

//The classes of the HTML elements we want to read from the DOM
const no_event_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x41vudc.x1603h9y.x1u7k74.x1xlr1w8.x12scifz.x2b8uid";
const event_link_class = "a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.x1s688f"; 

//EXECUTED COMMANDS
const orgData = await scrapeOrgData(scrape);

await logEvents(orgData);

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--lang=en-GB,en']
});

let eventList = await accessEventsPage(orgData,browser);
console.log(eventList);


async function accessEventsPage(orgData, browser)
{
    let eventList = []; // This array holds the events we want to export
    let eventLinks;
    const page = await browser.newPage();

    page.setExtraHTTPHeaders({
        "Accept-Language": "en",
    })

    for(let org of orgData){
        let fbURL = await checkFb(org.destinationURL);
        if(fbURL !== "Unknown")
        {
            await page.goto(fbURL, {
            waitUntil: "networkidle2",
            });

            //If we try to go to https://www.facebook.com/someorganisation/upcoming_hosted_events
            //The element called "no_event_class" will have the value of "No events to show"
            let check_value = await getElement(page, no_event_class, "innerHTML");

            if(await eventCheck(check_value))
            {
                eventLinks =  await getElementsArray(page, event_link_class, "href");
                let collectedEvents = await processEvents(eventLinks, page, org);
                eventList = eventList.concat(collectedEvents);
            }else eventLinks = "None";
        }
    }
    await browser.close();
    return eventList;
}

// false = Page has NO upcoming events ; true = Page 
async function eventCheck(string){
    if(string === "No events to show"){
        return false;
    }else return true;
}

async function checkFb(orgURL){
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
        eventPageURL = "Unknown"; //Just for now
    }
    return eventPageURL;
}


async function processEvents(eventLinks, page, org)
{
    let eventsArray = [];
    if(eventLinks === "None"){
        console.log("NO DATA");
    }

    // Get event data from workers
    let unProcessedData;
    await assignEventScrapeWorkers(eventLinks).then((data) => unProcessedData = data)

    for (let data of unProcessedData)
    {
        let processedData = await processInformation(data);
        processedData.orgName = org.name;
        processedData.orgContactInfo = org.contactInfo;
        eventsArray.push(processedData);
    }

    return eventsArray;
}

async function logEvents(orgData)
{
    for(let org of orgData)
    {
        console.log(org.destinationURL);
    }
}