//  Centralized environment variable management
import dotenv from "dotenv"
dotenv.config()

// ensure all critical env variables are avliable
const requiredConfig = [
  "PORT",
  "MONGO_URI",
  "ACCESS_SECRET",
  "REFRESH_SECRET",
  "CLIENT_URL", //reuired for CORS and secure cookie setup
  "NODE_ENV",
  "REDIS_URL",
];

requiredConfig.forEach(key =>{
    if (!process.env[key]) {
        console.error(`FATAL ERROR: Enviornment varaible, ${key} is not defined`)
        process.exit(1)
    }
})

// export configuration as config
export const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT:process.env.PORT,
    CLIENT_URL:process.env.CLIENT_URL,

    // DB
    MONGO_URI:process.env.MONGO_URI,

    // JWT Security
    JWT:{
        ACCESS_SECRET:process.env.ACCESS_SECRET,
        REFRESH_SECRET:process.env.REFRESH_SECRET,
        ACCESS_EXPIRY:"15m",
        REFRESH_EXPIRY:"7d",
        // cookie name for refresh
        REFRESH_COOKIE_NAME:"refreshToken"
    },

    // Rate Limiting
    RATE_LIMIT_MAX:parseInt(process.env.RATE_LIMIT_MAX,10) || 100 , //max rqst per window
    RATE_LIMIT_WINDOW_MS:parseInt(process.env.RATE_LIMIT_WINDOW_MS,10) || 15*60*1000 , //15 minutes

    // Security
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS,10) || 100,

    // Redis
    REDIS_URL:process.env.REDIS_URL
}