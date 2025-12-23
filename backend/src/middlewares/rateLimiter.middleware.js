import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { config } from '../config/index.js'
import { ApiError } from '../utils/apiError.utils.js'

// apply to all API routes
const globalRateLimiter = rateLimit({
    limit: config.RATE_LIMIT_MAX,
    legacyHeaders:false, // disable the `X-RateLimit-*` headers
    standardHeaders:"draft-8", // enable the `RateLimit-*` headers
    keyGenerator:(req,res,next)=>{
        return ipKeyGenerator(req.ip)
    },
    handler:(req,res,next,options)=>{
        const error = new ApiError(options.statusCode,"Too many requests , please try again later.",[])
        next(error)
    }
})


// stricter rate limiter for auth related routes (login,signup,forgot password)
const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  limit: 2, // max 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const error = new ApiError(
      options.statusCode,
      `Too many login attempts. Please try again in ${Math.ceil(
        options.windowMs / 1000
      )} seconds.`,
      []
    );
    next(error);
  },
});


export {
    globalRateLimiter,
    authRateLimiter
}