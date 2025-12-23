import { jwtService } from "../services/jwt.service.js";
import { ApiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

export const isAuth = asyncHandler(async (req, res, next) => {
  //
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    throw new ApiError(401,"Unauthorized access",["Authorization token missing"]);
  }

  const accessToken = authHeader.split(" ")[1]

  if(!accessToken){
    throw new ApiError(401,"Unauthorized access",["Authorization token missing"]);
  }

  let decoded;
  try {
    decoded = jwtService.verifyToken(accessToken,"access")
  } catch (error) {
    return next(error)
  }

  req.user = {
    id:decoded.userId,
    role:decoded.role
  }

  next()
});
