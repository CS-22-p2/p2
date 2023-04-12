import puppeteer from "puppeteer";
import {getData, processInformation} from "./web_crawler.js";
import { scrapeOrgData, scrape} from "./org_crawler.js";

const popUp_click = "div.x1iorvi4.xdl72j9";


//const orgData = await scrapeOrgData(scrape);
await loginFB();

async function loginFB(){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    let page = await browser.newPage();
    await page.goto("https://www.facebook.com/", {
        waitUntil: "networkidle2"
    });
    await page.type('#email', 'testing testing', {delay: 30});
    await page.type('#pass', 'testing testing', {delay: 30});
    await page.click('#u_0_5_xS');


}

async function accessEventsPage(orgData)
{
    //Not working for multiple pages, so i will try to do it for one 
    /*
    for(let org of orgData){
        let fbURL = await checkFb(org.destinationURL);
        let page = await browser.newPage();
        await page.goto(fbURL, {
            waitUntil: "networkidle2",
          });
    }
    */
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
        }else{
            eventPageURL += "/events";
        }
    }
    return eventPageURL;
}

async function logEvents(orgData)
{
    for(let org of orgData)
    {
        console.log(org.destinationURL);
    }
}