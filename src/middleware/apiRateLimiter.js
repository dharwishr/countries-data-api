const redis = require('./redis');
const apiInterceptor = (res, send) => (content) => {
    res.contentBody = content;
    res.send = send;
    res.send(content);
};
const apiRateLimter = () => async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    const requests = await redis.incr(ip);
    if(requests === 1){
        await redis.expire(ip, 60);
    }
    if(requests > 10){
        res.status(503).json({
            response: 'Error',
            callsMade: requests,
            msg: 'Too many calls made'
        });
    }
    else{
        res.send = apiInterceptor(res, res.send);
        next();
    }
}
module.exports = { apiRateLimter };