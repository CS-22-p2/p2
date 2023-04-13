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

  // Get all cards
  var cards = await page.evaluate(() => {
    const elements = document.querySelectorAll("div.ExpandableCard_ExpandableCard__P6qcZ")

    var arr = Array.from(elements)
    arr.forEach((element, index) => {
        arr[index] = element.id
    })

    return JSON.stringify(arr)
  }, page);

  // Convert back to an array and click on all cards
  cards = JSON.parse(cards)

  const doClick = async (id) =>
  {
    console.log("#"+id)
    await page.click("#" + id)
  }

  console.log(cards)
  cards.forEach(doClick)

  return
  
  // Click on all of the elements
  if (cards.length == 0)
  {
    console.log("Found no cards")
    return
  }

  const ElementToSearchString = function(element)
  {
    return element.tagName + element.className.Replace(" ", ".")
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