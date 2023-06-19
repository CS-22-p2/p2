import {
    workerData, parentPort
} from "worker_threads"

import { getData } from "./eventScraper.js"
import puppeteer from "puppeteer"
import { DeleteFirstPage } from "./orgScraper.js";

// Create a new browser
const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--lang=en-GB,en']
});

const page = await browser.newPage()
page.setExtraHTTPHeaders({
    "Accept-Language": "en",
})
DeleteFirstPage(browser)

// We have recieved an index from the main thread to process
parentPort.on("message", async (index) => {
    console.log("Index: ", index)

    if (index >= workerData.links.length) {
        await browser.close()
        process.exit()
    }

    let link = workerData.links[index]
    let data = await getData(link, page)

    parentPort.postMessage({
        index: index,
        data: data
    })
})
