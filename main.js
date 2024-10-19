const {program} = require('commander');
const http = require('http');

program
    .requiredOption("-h, --host <host>", "Server host")
    .requiredOption("-p, --port <port>", "Server port")
    .requiredOption("-c, --cache <cache>", "cache directory")
    
program.parse(process.argv);

const {host, port, cache} = program.opts();

const server = http.createServer((req, res) => {
    res.end('Server is running');
});
  
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});