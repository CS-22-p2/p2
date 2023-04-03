import puppeteer from 'puppeteer'
import fs from 'fs';
import { title } from 'process';

// Class representing data extracted from an organisation website
class OrgData {
  constructor(name, contactInfo, description, destinationURL)
  {
    this.name = name || ''
    this.contactInfo = contactInfo || ''
    this.description = description || ''
    this.destinationURL = destinationURL || ''
  }
}

// Class representing the url and classes that should be scraped
class OrgScrape {
  constructor(url, scrape)
  {
    this.url = url || ''

    // These are object structures containing 'class' and 'content' members.
    this.expandable = scrape.expandable || {class: '', shouldClick: false} // Contains a "should click" member instead
    this.name = scrape.name || {class: '', content: ''}
    this.contactInfo = scrape.contactInfo || {class: '', content: ''}
    this.description = scrape.description || {class: '', content: ''}
    this.destinationURL = scrape.destinationURL || {class: '', content: ''}
  }
}

// Takes a HTML element class and replaces empty space with "." for compatability with querying
function ClassToSearchableString(cls)
{
  return cls.replace(" ", ".")
}

// Temporary handle variables
async function ExtractContent(cardHandler, scrapeMember)
{
  // Find handler for the class
  const handler = await cardHandler.$(scrapeMember.class)
  if (handler != null)
  {
    // Get the text
    var propertyHandler = await handler.getProperty(scrapeMember.content)

    if (propertyHandler != null)
    {
      // Return json value
      return await propertyHandler.jsonValue()
    }
  else
    console.log("Failed to evaluate handler for class ", scrapeMember.class)
  }

  return "Unknown"
}

async function ExtractCardData(scrape, cardHandler)
{
  const data = new OrgData()

  // Extract name
  data.name = await ExtractContent(cardHandler, scrape.name)
  data.contactInfo = await ExtractContent(cardHandler, scrape.contactInfo)
  data.description = await ExtractContent(cardHandler, scrape.description)
  data.destinationURL = await ExtractContent(cardHandler, scrape.destinationURL)

  return data
}

// Extract data from all cards found on the org
async function ExtractCards(scrape, cards)
{
  const allOrgData = []

  // Loop over each card
  for (var cardId in cards) {
    const cardHandler = cards[cardId]

    // Expand the card
    if (scrape.expandable.shouldClick)
    {
      try {
        await cardHandler.click()
      } catch (error) {
        console.log("Failed to press expandable card...", cardHandler, error)
        continue
      }
    }

    // Extract and push to org array
    allOrgData.push(await ExtractCardData(scrape, cardHandler))
  }

  return allOrgData
}

const scrapeOrgData = async (scrape) => {
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
  await page.goto(scrape.url, {
    waitUntil: "networkidle2",
  });

  // Get all expandable cards
  var cards = await page.$$(scrape.expandable.class)
  
  return await ExtractCards(scrape, cards)
};

// Start the scraping
const scrape = new OrgScrape("https://www.studerende.aau.dk/studieliv/fritid-og-faellesskab/studenterorganisationer/oversigt", {
  expandable: {
    class: "div.ExpandableCard_ExpandableCard__P6qcZ",
    shouldClick: true,
  },
  name: {
    class: "h5.Heading_Heading__5IvtX.Heading_Heading___h5__i5794.ExpandableCard_ExpandableCard_heading__EtE4x",
    content: "textContent",
  },
  contactInfo: {
    class: "p.Paragraph_Paragraph__6scoC.Paragraph_Paragraph___medium__N4iI7.ExpandableCard_ExpandableCard_abstract__I_vmV",
    content: "textContent",
  },
  description: {
    class: "p.Label_Label__zGuNh.Label_Label___sm__zV3Td.ExpandableCard_ExpandableCard_label__Mtcnt",
    content: "textContent",
  },
  destinationURL: {
    class: "a.Link_Link__k_sCh.Link_Link___icon__KHlSc.ExpandableCard_ExpandableCard_link__tM1qF",
    content: "href"
  }
})

const orgData = await scrapeOrgData(scrape);
console.log(orgData)
console.log(orgData.length)