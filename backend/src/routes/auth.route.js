import {Router} from "express"
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/validation.middleware.js"
import { userLoginSchema, userRegisterSchema } from "../validators/auth.validator.js"
import { asyncHandler } from "../utils/asyncHandler.utils.js"
import { loginUser, logoutUser, refreshTokens, registerUser } from "../controllers/auth.controller.js"
import { noCache } from "../middlewares/security.middleware.js"

const authRouter = Router()
// Apply noCache to ALL auth routes
authRouter.use(noCache)

authRouter.post(
    "/register",
    authRateLimiter,
    validate(userRegisterSchema),
    asyncHandler(registerUser))

authRouter.post(
  "/login",
  authRateLimiter,
  validate(userLoginSchema),
  asyncHandler(loginUser)
);


authRouter.post("/refresh",asyncHandler(refreshTokens))
authRouter.post("/logout",asyncHandler(logoutUser))


export {authRouter}