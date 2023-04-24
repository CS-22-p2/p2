import {
    Worker
} from "worker_threads"

export {assignEventScrapeWorkers}

const maxWorkerCount = 2

async function assignEventScrapeWorkers(links)
{
    let linkCount = links.length

    // Prepare an array with room for data for every link
    let events = new Array(linkCount).fill(undefined)

    console.log("Scraping %d links: ", linkCount, links)

    return new Promise((resolve) => {
        if (linkCount == 0) {
            resolve(events)
            return
        }

        // Index of the next link in the array of links to be assigned and proccessed by a worker
        let index = 0

        // Actual worker count to be used based on the amount of links and capping at the maximum allowed
        let workerCount = Math.min(maxWorkerCount, linkCount)

        // Return and auto increment the next index to be used
        const nextIndex = () => {
            return index++
        }

        // Create the workers
        console.log("Creating %d out of a maximum of %d workers to begin scraping", workerCount, maxWorkerCount)
        for (let i = 0; i < workerCount; i++)
        {
            // Give the worker access to the same array of links and the page object, we uses indexes to tell the worker which link to work with
            const worker = new Worker("./scrape_worker_child.js", {
                // Shared data that exists both on the main and child threads. In this case we just want the child threads to know links
                workerData: {
                    links: links,
                }
            })

            // When we receive a message from a worker, it is likely because the worker has finished processing a link
            worker.on("message", (result) => {
                // Collect the data
                events[result.index] = result.data

                // Assign a new index to process
                worker.postMessage(nextIndex())
            })

            // If an error occurs log it
            worker.on("error", (err) => {
                console.log("A worker thread terminated with the following error trace: ", err)
            })

            // When the worker terminates, track the worker count by decrementing and logging it
            worker.on("exit", (code) => {
                --workerCount
                console.log("Worker thread exited with ExitCode %d, there are %d workers remaining", code, workerCount)

                if (workerCount <= 0) resolve(events)
            })

            // Post the original index to be used
            worker.postMessage(nextIndex())
        }
    })
}

//await assignEventScrapeWorkers(new Array(10).fill("https://www.facebook.com/events/205729292181399/")).then((data) => console.log(data))