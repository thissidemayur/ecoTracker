import {Router} from "express"
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/validation.middleware.js"
import {  userRegisterSchema } from "../validators/auth.validator.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import {  registerUser } from "../controllers/auth.controller.js"
import { noCache } from "../middlewares/security.middleware.js"

const authRouter = Router()
// Apply noCache to ALL auth routes
authRouter.use(noCache)

authRouter.post(
    "/register",
    authRateLimiter,
    validate(userRegisterSchema),
    asyncHandler(registerUser))



export {authRouter}