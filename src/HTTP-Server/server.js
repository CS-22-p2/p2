import http from 'http';
import fs  from 'fs';
import url from 'url';
import path from 'path';

const hostname = '127.0.0.1';
const port = 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // This part handels GET methods, providing the user with the requested documents
        const filePath = path.join(publicDirectoryPath, path.normalize(req.url === '/' ? 'loginPage.html' : req.url));
        const extname = path.extname(filePath);
        let contentType = 'text/html';
    
        contentType = getContentType(extname);
    
        fs.readFile(filePath, (err, content) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        res.writeHead(404);
                        res.end(`File not found: ${req.url}`);
                    } else {
                        res.writeHead(500);
                        res.end(`Server error: ${err.code}`);
                    }
                } else {
                    console.log(contentType);
                    res.writeHead(200, {'contentType': contentType});
                    res.end(content, 'utf-8');
                }
        });
    } else if (req.method === 'PUT') {
        // This part handels the PUT methods letting the user return data to the http server
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(`Received PUT request with body: ${body}`)
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('PUT request successful');
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET, PUT');
        res.end('Method not allowed');
      }
}); 

function getContentType(extname) {
    switch (extname) {
        case '.js':
            return 'text/javascript';
            break;
        case '.html':
            return'text/html';
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
            return'image/gif';
            break;
        case '.webp':
            return'image/webp';
            break;
        case '.avif':
            return'image/avif';
            break;
      }
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});