import puppeteer from 'puppeteer'
import { Event } from "./eventClass.js";
import { checkPrime } from 'crypto';
export {getData, processInformation, getElement, getElementsArray};
 
//The classes of the HTML elements we want to read from the DOM
// _click suffix indicates that it is a "clickable" DOM element
const popUp_click = "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1iyjqo2.xs83m0k.x150jy0e.x1e558r4.xjkvuk6.x1iorvi4.xdl72j9";
const seeMore_click = "div.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f";
const image_click = "img.x1ey2m1c.x9f619.xds687c.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3";
const date_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.x1xlr1w8.x1a1m0xk.x1yc453h";
const title_class = "h1.x1heor9g.x1qlqyl8.x1pd3egz.x1a2a7pz.x193iq5w.xeuugli";
const participants_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x41vudc.x1603h9y.x1u7k74.x1xlr1w8.xzsf02u.x2b8uid";
const tickets_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h";
const location_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xi81zsa.x1yc453h";
const details_class = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h";
const hosts_class = "span.xt0psk2";
const description_class = "div.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.xtlvy1s";
const image_class = "img.x85a59c.x193iq5w.x4fas0m.x19kjcj4";

/**
 * Extracts any HTML-element from any given Web-page
 * @param {"The current page, the browser is visitting through puppeteer"} page 
 * @param {"Provided selector (class, id, title etc.)"} selector 
 * @param {"User specified property of the selected DOM-element eg. innerText or textContent"} property 
 * @returns String - Element Property
 */

async function getElement(page, selector, property)
{
  const element = await page.evaluate((selector, property) => {
    let data = document.querySelector(selector);
    if(data !== null)
    {
      return data[property];
    }else return undefined;
  }, selector, property)
  return element;
}

//Checks if an element exists on the webpage
async function checkElement(page, selector)
{
  return getElement(page, selector, "outerHTML") !== null;
}

/** 
 * Clicks on an element on a WebPage
 * @param {"The current page, the browser is visitting through puppeteer"} page 
 * @param {"Provided selector (class, id, title etc.)"} selector 
 * @param {"A string that must match the innerText of the element"} identifier 
 */
async function clickElement(page, selector, identifier)
{
  //Reason for providing identifier: 
  //Different HTML-elements often have the same selector(Often 2-3 elements)
  //We can select the specific element based on the provided innerText in the element
  //If the innerText matches the identifier -> Click

  //Element we can click based on selector
  const clickableElements = await page.$$(selector);

    for(let element in clickableElements)
    {
      //Handler for each element(needed to actually be able to click)
      let propertyHandler = await clickableElements[element].getProperty("innerText");

      if(await propertyHandler.jsonValue() === identifier)
      {
        await clickableElements[element].click();
      }
    }
}

async function getElementsArray(page, selector, attribute)
{
  const elements = await page.evaluate((selector, attribute) => {
    const element_list = document.querySelectorAll(selector);
    let element_array = Array.from(element_list).map((element) => element[attribute]);
    return element_array;
  }, selector, attribute);
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

async function clickImage(page, selector)
{
  const clickableElement = await page.$$(selector);
  //There are to clickable elements for the same image, but we need the 2'nd one every time
  await clickableElement[1].click();
}

async function getData(link, page) {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)

  await page.goto(link, {
    waitUntil: "networkidle2",
  });
  
  //Clicks away from the popup if there is any
  if(await checkElement(page, popUp_click))
  {
    await clickElement(page, popUp_click, "Allow essential and optional cookies");
  }

  //Opens the "See More" section of description
  await clickElement(page, seeMore_click, "See more");

  const eventDate = await getElement(page, date_class, "textContent");
  const eventLink = await getURL(page);
  const eventTitle = await getElement(page, title_class, "textContent");
  const eventLocation = await getElement(page,location_class, "textContent");
  const eventParticipants = await getElement(page, participants_class, "textContent");
  const eventTickets = await getElement(page, tickets_class, "textContent");
  const eventDetails = await getElementsArray(page, details_class, "textContent");
  const eventHosts = await getElementsArray(page, hosts_class, "textContent");
  const eventDescription = await getElementsArray(page, description_class, "textContent");

  //To get the image we need to go to the image page... Otherwise encrypted :(
  await clickImage(page, image_click);

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
  description += element;
 }
 description = description.replace("See less","");
 event_data.eventDescription = description;

 return event_data; 
}

// Start the scraping
/* let gathered_data = await getData("https://www.facebook.com/events/218255994227964/?ref=newsfeed");
let output_event = await processInformation(gathered_data);
console.log(output_event); */

