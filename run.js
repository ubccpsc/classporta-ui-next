const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const config = require('./config');
const PORT = process.env.NODE_ENV === 'production' ? 443 : 3000;

// configure express app
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/static/', express.static(config.staticHtmlPath));
app.use('/public/', express.static(path.resolve(__dirname, './build/public')));
app.use('/html/', express.static(path.resolve(__dirname, './app/html')));
app.use('/dist/', express.static(path.resolve(__dirname, './app/build/dist')));
app.use('/lib/', express.static(path.resolve(__dirname, './app/lib')));
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, './app/index.html'));
});
app.use('/', express.static(path.resolve(__dirname, './app')));


let sslCert = fs.readFileSync(config.sslCertPath, 'utf8');
let sslKey = fs.readFileSync(config.sslKeyPath, 'utf8');
let sslIntCert = fs.readFileSync(config.sslIntCert, 'utf8');

// create server SSL credentials
let options = {cert: sslCert, key: sslKey, ca: sslIntCert};

// config http --> https redirect
let redirectApp = new express();
redirectApp.get('*', function (req, res) {
    if (process.env.NODE_ENV === 'production') {
        res.redirect('https://' + req.hostname + req.url);
    } else {
        res.redirect('https://' + req.hostname + String(req.url).replace(/\/$/, "") + ':' + PORT);
    }
});

// create servers
let httpServer = http.createServer(redirectApp);
let httpsServer = https.createServer(options, app);

// ## SOCKET IO - Adds Client interface to index.html through <script> tag ##
const io = require('socket.io')(httpsServer);

io.on('connection', () => {
    console.log('user connected');
});
// ##

// start servers
httpServer.listen(80, function (err) {
    if (err) {
        console.log('Error: ' + err)
    }
    console.log('Started server in production mode on 80 for redirects to ' + PORT);
});

httpsServer.listen(PORT, function (err) {
    if (err) {
        console.log('Error: ' + err)
    }
    console.log('Started server in production mode on ' + PORT);
});
