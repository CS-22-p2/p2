import puppeteer from "puppeteer";
import {getData, processInformation} from "./web_crawler.js";
import { scrapeOrgData, scrape} from "./org_crawler.js";

let orgData = await scrapeOrgData(scrape);
await logEvents(orgData);
await checkFb(orgData[7].destinationURL);

/*
let gatheredData = await getData("https://www.facebook.com/events/155003607431682/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22discovery_top_tab%22%2C%22surface%22%3A%22bookmark%22%7D]%2C%22ref_notif_type%22%3Anull%7D");
let processedData = await processInformation(gatheredData);
console.log(processedData);
*/



async function accessEventsPage(fbURL)
{
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
    
      // Open a new page
      const page = await browser.newPage();
    
      // On this new page:
      // - open the "http://quotes.toscrape.com/" website
      // - wait until the dom content is loaded (HTML is ready)
      await page.goto(fbURL, {
        waitUntil: "networkidle2",
      });
}

async function checkFb(orgURL){
    let eventPageURL = orgURL;

    //Checks if the URL is a link to facebook
    if(orgURL.includes("facebook"))
    {
        //Some URL's have a trailing / which we need to take into account
        if(orgURL.at(-1) === "/")
        {
            eventPageURL += "events";
            accessEventsPage(eventPageURL);
        }else{
            eventPageURL += "/events";
            accessEventsPage(eventPageURL);
        }
    }
}

async function logEvents(orgData)
{
    for(let org of orgData)
    {
        console.log(org.destinationURL);
    }
}