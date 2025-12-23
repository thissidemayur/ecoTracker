import { createClient } from "redis";
import { config } from "./index.js";

const redisClient = createClient({
  url:config.REDIS_URL,
  socket:{
    reconnectStrategy:(retries)=>{
      if(retries >20) {
        console.error(
          "Redis: Failed to reconnect after 20 attempts. Stopping reconnection attempts."
        );
        return null; // Stop reconnecting

      }
      return Math.min(retries*50,1000); // Exponential backoff up to 1 second ; purpose is to avoid overwhelming the server
    }
  }
});

redisClient.on("connect", () => {
  console.log("Redis: Connection established successfully.");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
  throw err;

});


// Connect to Redis server
async function connectRedis() {
  try {
    await redisClient.connect()
    console.log("Redis: Ready state archieved.")
  } catch (error) {
    console.log("Redis: Inital connection failed")
    throw error
  }
}

export {redisClient,connectRedis}