var redis = require('./redis');
var {apiInterceptor} = require("./apiInterceptor")

const apiRateLimiter = () => async (req, res, next) => {
    try {
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        let requests = await redis.incr(ip);
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
    } catch (err) {
        next(err)
    }
};
module.exports = { apiRateLimiter };