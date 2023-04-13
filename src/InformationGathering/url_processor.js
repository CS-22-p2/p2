import puppeteer from "puppeteer";
import {getData, processInformation} from "./web_crawler.js";
import { scrapeOrgData, scrape} from "./org_crawler.js";

const popUp_click = "div.x1iorvi4.xdl72j9";


const orgData = await scrapeOrgData(scrape);
await logEvents(orgData);
let browser = await loginFB();

async function loginFB(){

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    let page = await browser.newPage();
    await page.goto("https://www.facebook.com/", {
        waitUntil: "networkidle2"
    });
    await page.click('button._42ft._4jy0._9xo7._4jy3._4jy1.selected._51sy');
    await page.type('#email', 'williamscrapius@gmail.com', {delay: 30});
    await page.type('#pass', 'cs23sw202', {delay: 30});
    await page.click('button._42ft._4jy0._6lth._4jy6._4jy1.selected._51sy', {delay: 30});
    await page.waitForNetworkIdle(30);
    await page.goto('https://www.facebook.com/IdaPaaAau', {
        waitUntil: 'networkidle2',
        delay: 30
    })
    return browser;
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