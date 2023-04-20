import puppeteer from 'puppeteer'
import fs from 'fs';
const array =[];

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
  await page.goto("https://www.facebook.com/events/3513436882315960", {
    waitUntil: "domcontentloaded",
  });

  // Get page data
 const eventTitle = await page.evaluate(() => {
  // Fetch the first element with class "quote"

  setTimeout (() => {
    const title = document.querySelector("span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xg8j3zb").innerText;
    console.log (title);
  },10)

  setTimeout (() => {
    const date = document.querySelector(".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.x1xlr1w8.x1a1m0xk.x1yc453h").innerText;
    console.log (date);
  },10)
  
  setTimeout (() => {
    const peopleResponded = document.querySelector("x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h").innerText;
    console.log (date);
  },10)

  setTimeout (() => {
    const peopleResponded = document.querySelector("x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h").innerText;
    console.log (peopleResponded);
  },10)

  const hostes = document.querySelector("span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h");
  forEach(host in hostes)

  setTimeout (() => {
    const host = document.querySelector("a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.xt0b8zv.xzsf02u.x1s688f").innerText;
    console.log (host);
  },15)

  
});
};



// Start the scraping
getData();