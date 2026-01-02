import { createClient } from "redis";
import { config } from "./index.js";

const redisClient = createClient({
  url: config.REDIS_URL,
  socket: {
    // Upstash uses TLS; ensure the client handles the handshake correctly
    tls: true,
    // TCP Keep-Alive: Sends a packet every 30s to keep the connection "warm"
    keepAlive: 30000,
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.error("Redis: Max reconnection attempts reached.");
        return new Error("Redis reconnection failed");
      }
      // Wait longer between retries as they fail
      return Math.min(retries * 100, 3000);
    },
  },
});

// SUCCESS LISTENER
redisClient.on("connect", () => {
  console.log("✅ Redis: Connection established.");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis: Client ready to use.");
});

// ERROR LISTENER (Crucial Change)
redisClient.on("error", (err) => {
  // Log the error but DO NOT THROW.
  // Throwing here kills your Express/Next.js server process.
  console.error("❌ Redis Client Error:", err.code || err.message);

  if (err.code === "ECONNRESET") {
    console.warn("Redis: Connection was reset by Upstash. Reconnecting...");
  }
});

// INITIAL CONNECTION
async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("❌ Redis: Initial connection failed:", error.message);
    // Only throw during the initial boot-up if it's a fatal requirement
    throw error;
  }
}

export { redisClient, connectRedis };
