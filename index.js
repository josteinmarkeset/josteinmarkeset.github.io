const express = require('express');
const morgan = require('morgan')
const app = express();

const PORT = 8080;

function getOS(agent) {
    let OS = 'unknown';

    if(!agent) return OS;
    agent = agent.toLowerCase();

    if(agent.includes('linux')) OS = 'Linux';
    else if(agent.includes('windows')) OS = 'Windows';
    else if(agent.includes('macintosh')) OS = 'OSX';

    console.log(agent);

    return OS;
}

function parseIP(rawIP) {
    if (rawIP.substr(0, 7) === "::ffff:") return rawIP.substr(7);
    else if(rawIP.substr(0, 3) === "::1") return '127.0.0.1';
    else return 'unknown'; 
}

function getIP(req) {
    const rawIP = (req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).split(",")[0];
    
    return parseIP(rawIP);
}

app.set('view engine', 'ejs')
app.use(morgan(':remote-addr :method :url', {
    skip: (req, res) => { console.log('===========================================================') }
}));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => { 
    const userAgnet = req.get('User-Agent');
    const OS = getOS(userAgnet);
    const IP = getIP(req);

    res.render('index', {
        IP: IP,
        OS: OS
    });
});

// Init
app.listen(PORT);
console.log(`Listening on port ${PORT}`);