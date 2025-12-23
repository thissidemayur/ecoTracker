import { config } from "../config/index.js"
import { ApiError } from "../utils/apiError.utils.js"

// Global Error Handler Middleware
const errorHandler = (err,req,res,next) =>{
    // 1. initalisze statusCode & msg 
    let statusCode = err?.statusCode || 500 // default to 500 unless the err has defined statusCode(like custome APiError)
    let message = err?.message || "Internal Server Error"
    let errors = err?.error || [] 
    let stack = err?.stack
    let isOperational = err?.isOperational || false
    // 2. handle system Opereational error (like mongoose)

    // 2.1 Mongoose Validation Error(eg required fields missing)
    if (err.name === "ValidationError") {
        statusCode = 400,
        message = "Validation Failed"
        errors = Object.values(err.errors).map((val)=>val.message)
        isOperational = true
    }

    // 2.2 Mongoose Cast Error (eg invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400,   
        message = "Invalid Request Parameters",
        errors = [`${err.path} : ${err.value} is invalid.`]
        isOperational = true
    }

    // 2.3 Mongoose Duplicate Key Error (eg duplicate unique field)
    if (err.code && err.code === 11000) {
        statusCode = 400,
        message = "Duplicate Resource!",
        errors = Object.keys(err.keyValue).map(field => `${field}: ${err.keyValue[field]} already exists.`)
        isOperational = true
    }
    

    // 2.4 JWT Error (invalid token or expired token ) comes from jsonwebtoken package
    if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
        statusCode = 401,
        message = "Unauthoized",
        errors = ["Invalid or expired token. Please login again."]
        isOperational = true

    }


    // 3. Progrmmatic Error

    // progrmmatic errors in production
    if(!isOperational && config.NODE_ENV === "production" ){
        console.error("PROGRAMMATIC ERROR 💥: ", err)
        statusCode = 500
        message = "Internal Server Error"
        errors = []
        stack = null
    }

    // programmatic errors in development
    if(!isOperational && config.NODE_ENV === "development" ){
        console.error(`PROGRAMMATIC ERROR 💥: ${err} `)
        // we keep the original err info for debugging
    }


    // 4. Error Response Object
    const errorResponse = {
        statusCode,
        message,
        errors,
        success:false,
        data : null,
        stack: config.NODE_ENV === "development" ? stack : undefined
    }

    // 5. Send error resonse
    res.status(statusCode).json(errorResponse)

}


// 404 Not Found Middleware
const notFound = (req,res,next) =>{
    const error = new ApiError(404,`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}


export  {
    errorHandler,
    notFound
}