const {program} = require('commander');
const http = require('http');
const fs = require ('fs').promises
const path = require('path');

program
    .requiredOption('-h, --host <host>', 'Server host')
    .requiredOption('-p, --port <port>', 'Server port')
    .requiredOption('-c, --cache <cache>', 'cache directory')
    
program.parse(process.argv);

const {host, port, cache} = program.opts();

const server = http.createServer(async (req, res) => {
    const code = req.url.slice(1);
    const filePath = path.join(cache, `${code}.jpg`);

    if (req.method === 'GET') {
        try {
            const data = await fs.readFile(filePath);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(data);
        } 
        catch (err) {
            res.writeHead(404);
            res.end('Not Found');
        }
    } 
    else if (req.method === 'PUT') {
        let test = [];
        req.on('data', chunk => {
            test.push(chunk);})
            
        req.on('end', async () => {
            test = Buffer.concat(test);
            try {
                await fs.writeFile(filePath, test);
                res.writeHead(201);
                res.end('Created');
            } catch (err) {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
    } else if (req.method === 'DELETE') {
        try {
            await fs.unlink(filePath);
            res.writeHead(200);
            res.end('OK');
        } catch (err) {
            res.writeHead(404);
            res.end('Not Found');
        }
    } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

  
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});