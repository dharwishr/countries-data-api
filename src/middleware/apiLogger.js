var moment = require('moment')
var fs = require('fs');
var format = 'DD/MM/YYYY h:mm:ss A'

const apiLogger = (req, res) => {
    var timestamps = moment().format(format)
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    var logStream = fs.createWriteStream('log.txt', {flags: 'a', encoding: 'utf8'});
    logStream.write(`${timestamps } ${req.method} ${req.url} ${JSON.stringify(req.body)} ${res.statusCode} ${ip} \n`)
    };

module.exports = { apiLogger };