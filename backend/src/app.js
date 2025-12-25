import express from "express"
import cors from "cors"
import helmet from "helmet"
import {config} from "./config/index.js"
import cookieParser from "cookie-parser"
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js"
import { errorHandler } from "./middlewares/errorHandler.controller.js"
import {sanitizedBodyMiddleware } from "./middlewares/InputSanitization.js"
import { securityHeaders } from "./middlewares/security.middleware.js"
// imports for middlewares and routes
import { healthCheckRouter } from "./routes/healthCheck.js"
const app = express()

app.use(healthCheckRouter);

// 1. Security Middlewares (Helmet)
// add several criticals HTTP headers to protect aganist common attacks
app.use(helmet())

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true, // allow cookies(Refresh token) to be sent from the client
  })
);

// Global Security: Apply to every single request hitting the server
app.use(securityHeaders)

// 2. Rate Limiting (General API Protection) - DDoS and Brute-Force Protection
app.use(globalRateLimiter)

// 3. CORS configuration

// 4. Request body parser
app.use(express.json({limit:"16kb"})) // parse incoming JSON payloads(upto 16kb to prevent DoS attacks)
app.use(express.urlencoded({extended:true, limit:"16kb"})) // parse URL-encoded payloads (often used with HTML forms)
app.use(cookieParser()) // parse cookies from incoming request headers

// 5. Sanitization Middlewares
// app.use(sanitizedBodyMiddleware);
// 5. Centeral Controllers (all api routes)
app.use("/api/v1",router)

// 6. Error Handling Middlewares
// app.use(notFound) // middleware to catch rqst to undefined routes (404 errors)
app.use(errorHandler) //Global error handler middleware (handle errros parse via next(err) and our ApiError class defined in utils/ApiError.js) )


export default app