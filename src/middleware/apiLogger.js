var moment = require('moment')
var fs = require('fs');
var format = 'DD/MM/YYYY h:mm:ss A'
var logStream = fs.createWriteStream('./log.txt', {flags: 'a', encoding: 'utf8'});

const apiLogger = () => (req, res, next) => {
    let timestamps = moment().format(format)
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    logStream.write(`${timestamps } ${req.method} ${req.url} ${JSON.stringify(req.body)} ${res.statusCode} ${ip} \n`)
    next();    
};

module.exports = { apiLogger };