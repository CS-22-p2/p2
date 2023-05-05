// Imports
import { createUser, checkLogin } from '../user-system/userHandler.js';
import { getNewestEntries, updateFavorite } from '../database/databaseHandler.js';
import { get_sorted_events } from '../data-process/eventSorting.js';
import http from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, 'public');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET') {
        // This handels get request asking for data
        if(req.url.includes('/getEvents')) {
            const events = await getEvents();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(events));
            return;
        } else if (req.url.includes('/getFevorites')) {
            let query = extractQuery(req.url);
            const events = await getFavorites(parseInt(query[0].value))
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(events));
            return;
        }
        // This part handels GET methods, providing the user with the requested documents
        const filePath = path.join(publicDirectoryPath, path.normalize(req.url === '/' ? '/html/landingPage.html' : req.url));
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        // Gets the extension name e.g. ".js"
        contentType = getContentType(extname);
        fs.readFile(filePath, async (err, content) => {
            if (err) {
                // Responds with error if there is any
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end(`File not found: ${req.url}`);
                } else {
                    res.writeHead(500);
                    res.end(`Server error: ${err.code}`);
                }
            } else { // Responds with the request content
                console.log(contentType);
                res.writeHead(200, { 'contentType': contentType });
                res.end(content, 'utf-8');
            }
        });
    } else if (req.method === 'POST') {
        if (req.url = "/sortedEvents") {
            //This part handles the POST methods when the user wants to sort events
            //In the user-agent request the body element containt the sorting option
            let body = '';
            // Grabs the data sent by the fetch request
            req.on('data', (chunk) => {
                body += chunk.toString();
                body = JSON.parse(body);
            });
            req.on('end', async () => {
                console.log(body);
                if(body === "dateOpt")
                {
                    let eventResponse = await get_sorted_events("eventDate");
                    res.writeHead(200, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ events: eventResponse}));
                }else if(body === "relevanceOpt")
                {
                    let eventResponse = await get_sorted_events("relevancyScore");
                    res.writeHead(200, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ events: eventResponse}));
                }
            })
        }
    } else if (req.method === 'PUT') {
        // This part handels the PUT methods letting the user return data to the http server
        let body = '';
        // Grabs the data sent by the fetch request
        req.on('data', (chunk) => {
            body += chunk.toString();
            body = JSON.parse(body);
        });
        // When the full request is received it gets processed
        req.on('end', async () => {
            console.log(body);
            if (body.type === "login") {
                // Do login stuff

                let result = await checkLogin(body);

                // If the login info provided does not match anything in the userDb it responds with an error
                if (result == false) {
                    res.writeHead(406);
                    res.end(JSON.stringify({ message: 'PUT request unsuccessful' }));
                    return false;
                }
                // Else it returns a successful message + a coockie containing the user credentials
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'PUT request successful', cookie: result }));

                return true;
            } else if (body.type === "signUp") {
                // if the request type is signup it creates a new user
                let result = await createUser(body);
                console.log("Trying to sign up");
            } else if (body.type === "favorite") {
                // Function that adds event id to favorite list
                await updateFavorite(body.userId, body.eventId);
            }
            console.log(`Received PUT request with body: ${body}`)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'PUT request successful' }));
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET, PUT');
        res.end('Method not allowed');
    }
});

// This returns the http doctype based on the provided extension name e.g. ".html" = text/html
function getContentType(extname) {
    switch (extname) {
        case '.js':
            return 'text/javascript';
            break;
        case '.html':
            return 'text/html';
            break;
        case '.css':
            return 'text/css';
            break;
        case '.json':
            return 'application/json';
            break;
        case '.png':
            return 'image/png';
            break;
        case '.jpg':
            return 'image/jpg';
            break;
        case '.jpeg':
            return 'image/jpeg';
            break;
        case '.gif':
            return 'image/gif';
            break;
        case '.webp':
            return 'image/webp';
            break;
        case '.avif':
            return 'image/avif';
            break;
    }
}

function extractQuery(url) {
    let split = url.split("?");
    let querys;
    let result = [];
    for (let i = 0; i < split.length; i++) {
        if (split[i].includes("=")) {
            querys = split[i];
        }
    }
    querys = querys.split("=")
    for (let i = 0; i < querys.length; i += 2) {
        result.push({query: querys[i], value: querys[i + 1]});
    }
    return result;
}

async function getEvents() {
    const result = await getNewestEntries("events"); // This might need to be updated a tiny bit
    return result;
}

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});