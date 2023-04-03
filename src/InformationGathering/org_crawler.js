import puppeteer from 'puppeteer'
import fs from 'fs';
import { title } from 'process';

const getData = async () => {
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
  await page.goto("https://www.studerende.aau.dk/studieliv/fritid-og-faellesskab/studenterorganisationer/oversigt", {
    waitUntil: "networkidle2",
  });

  const ElementToSearchString = function(element)
  {
    return element.tagName + element.className.Replace(" ", ".")
  }

  // Get all cards
  var cards = await page.$$("div.ExpandableCard_ExpandableCard__P6qcZ")

  async function ExtractCardURLs(cards)
  {
    const allOrgData = []

    // Loop over each card
    for (var cardId in cards) {
      const cardHandler = cards[cardId]

      // Expand the card
      try {
        await cardHandler.click()
      } catch (error) {
        console.log("Failed to press expandable card...", cardHandler)
        continue
      }

      const OrgData = {
        name: "Unknown",
        contactInfo: "Unknown",
        description: "Unknown",
        destinationURL: ""
      }

      // Temporary handle variables
      async function ExtractContent(cardHandler, cls, content)
      {
        // Find handler for the class
        const handler = await cardHandler.$(cls)
        if (handler != null)
        {
          // Get the text
          var propertyHandler = await handler.getProperty(content)

          if (propertyHandler != null)
          {
            // Return json value
            return await propertyHandler.jsonValue()
          }
        }

        return "Unknown"
      }

      // Extract name


      OrgData.name = await ExtractContent(cardHandler, "h5.Heading_Heading__5IvtX.Heading_Heading___h5__i5794.ExpandableCard_ExpandableCard_heading__EtE4x", "textContent")
      OrgData.contactInfo = await ExtractContent(cardHandler, "p.Paragraph_Paragraph__6scoC.Paragraph_Paragraph___medium__N4iI7.ExpandableCard_ExpandableCard_abstract__I_vmV", "textContent")
      OrgData.description = await ExtractContent(cardHandler, "p.Label_Label__zGuNh.Label_Label___sm__zV3Td.ExpandableCard_ExpandableCard_label__Mtcnt", "textContent")
      OrgData.destinationURL = await ExtractContent(cardHandler, "a.Link_Link__k_sCh.Link_Link___icon__KHlSc.ExpandableCard_ExpandableCard_link__tM1qF", "href")

      allOrgData.push(OrgData)
    }

    return allOrgData
  }

  const AllOrgData = await ExtractCardURLs(cards)
  console.log(AllOrgData)

  // Convert back to an array and click on all cards
  return
  
  // Click on all of the elements
  if (cards.length == 0)
  {
    console.log("Found no cards")
    return
  }

  cards.forEach((element) => {
    console.log(element)
  })

  // Get org data from these cards
  const orgData = await page.evaluate(() => {
    const allOrgData = []

    setTimeout(() => {
        cards.forEach((element) => {
            // Extract name
            const titleElement = element.querySelector("h5.Heading_Heading__5IvtX.Heading_Heading___h5__i5794.ExpandableCard_ExpandableCard_heading__EtE4x")
            
            // Extract contact info
            const contactElement = element.querySelector("p.Paragraph_Paragraph__6scoC.Paragraph_Paragraph___medium__N4iI7.ExpandableCard_ExpandableCard_abstract__I_vmV")

            // Extract description
            const descriptionElement = element.querySelector("p.Label_Label__zGuNh.Label_Label___sm__zV3Td.ExpandableCard_ExpandableCard_label__Mtcnt")

            // Extract destination URL

            const destinationElement = element.querySelector("a.Link_Link__k_sCh.Link_Link___icon__KHlSc.ExpandableCard_ExpandableCard_link__tM1qF")
            console.log(destinationElement)

            allOrgData.push({
                name: titleElement.textContent,
                contactInfo: contactElement.textContent,
                description: descriptionElement.textContent,
            })
        })
    }, 0)

    return allOrgData
  });

  console.log(orgData)
};



// Start the scraping
getData();