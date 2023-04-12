import puppeteer from 'puppeteer'
import fs from 'fs';
import { get } from 'http';
import { Event } from "./eventClass.js";
export {getData, processInformation};
 
const popUp_click = "div.x1iorvi4.xdl72j9";
const seeMore_click = "div.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f";
const image_click = "div.x1qjc9v5.x1q0q8m5.x1qhh985.xu3j5b3.xcfux6l.x26u7qi.xm0m39n.x13fuv20.x972fbf.x1ey2m1c.x9f619.x78zum5.xds687c.xdt5ytf.x1iyjqo2.xs83m0k.x1qughib.xat24cr.x11i5rnm.x1mh8g0r.xdj266r.x2lwn1j.xeuugli.x18d9i69.x4uap5.xkhd6sd.xexx8yu.x10l6tqk.x17qophe.x13vifvy.x1ja2u2z";
const date_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.x1xlr1w8.x1a1m0xk.x1yc453h";
const title_class = "h1.x1heor9g.x1qlqyl8.x1pd3egz.x1a2a7pz.x193iq5w.xeuugli";
const participants_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x41vudc.x1603h9y.x1u7k74.x1xlr1w8.xzsf02u.x2b8uid";
const tickets_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h";
const location_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xi81zsa.x1yc453h";
const details_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h";
const hosts_class = "span.xt0psk2";
const description_class = "div.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.xtlvy1s";
const image_class = "img.x85a59c.x193iq5w.x4fas0m.x19kjcj4";

async function getElement(page, selector)
{
  const element = await page.evaluate((selector) => {
    let data = document.querySelector(selector);
    if(data !== null)
    {
      return data.innerText;
    }else return undefined;
  }, selector)
  return element;
}

async function getElementsArray(page, selector)
{
  const elements = await page.evaluate((selector) => {
    const element_list = document.querySelectorAll(selector);
    let element_array = Array.from(element_list).map((element) => element.innerText);
    return element_array;
  }, selector);
  return elements;
}

async function getURL(page){
  let url = await page.evaluate(() => {
    let link = window.location.href;
    return link;
  })
  return url;
}

async function getImage(page, selector){
  const image_url = await getURL(page);
  await page.goto(image_url, {
    waitUntil: "networkidle2",
  });
  
  const eventImage = await page.evaluate((selector) => {
    let image = document.querySelector(selector).currentSrc;
    return image;
  }, selector)
  return eventImage;
}

const getData = async (link) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(link, {
    waitUntil: "networkidle2",
  });
  
//Clicks away from the popup
await page.click(popUp_click);
//Opens the see more section of description
await page.click(seeMore_click); 

const eventDate = await getElement(page, date_class);
const eventLink = await getURL(page);
const eventTitle = await getElement(page, title_class);
const eventLocation = await getElement(page,location_class);
const eventParticipants = await getElement(page, participants_class);
const eventTickets = await getElement(page, tickets_class);
const eventDetails = await getElementsArray(page, details_class);
const eventHosts = await getElementsArray(page, hosts_class);
const eventDescription = await getElementsArray(page, description_class);

//To get the image we need to go to the image page... Otherwise encrypted :(
await page.click(image_click);
const eventImage = await getImage(page, image_class);

return {eventLink, eventTitle, eventDate, eventHosts, eventParticipants, eventLocation, eventDetails, eventDescription, eventTickets, eventImage};
};

async function processInformation(gatheredData)
{
  let event_data = new Event();
  let description = "";

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

  //Processing details. Since details is an array, and often appears in a 
  for(let element of gatheredData.eventDetails)
  {
    if(element.includes("Duration:") || element.includes("days")){
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
  description += element;
 }
 description = description.replace("See less","");
 event_data.eventDescription = description;

 console.log(event_data);

 return event_data; 
}


// Start the scraping
/*
let gathered_data = await getData("https://www.facebook.com/events/155003607431682/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22discovery_top_tab%22%2C%22surface%22%3A%22bookmark%22%7D]%2C%22ref_notif_type%22%3Anull%7D");
let output_event = await processInformation(gathered_data);
*/
