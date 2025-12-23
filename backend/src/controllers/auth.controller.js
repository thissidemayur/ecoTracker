import { config } from "../config/index.js"
import { authService } from "../services/auth.service.js"
import { jwtService } from "../services/jwt.service.js"
import { ApiResponse } from "../utils/apiResponse.utils.js"

/**
 * @description 
 */
const registerUser = async(req,res)=>{
    const {email,password} = req.body
    const {user,accessToken,refreshToken} = await authService.registerUser({email,password,role:req.body.role, username:req.body.username})

    // set refresh token in httpOnly cookie
    res.cookie(
        config.JWT.REFRESH_COOKIE_NAME,
        refreshToken,
        jwtService.getRefreshCookieOptions()
    )
    
    return res.status(201).json(new ApiResponse(201,"User registered successfully",{
        user,accessToken
    }))
}





export {  registerUser };