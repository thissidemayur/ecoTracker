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


const loginUser = async(req,res)=>{
    const {user,accessToken,refreshToken} = await authService.loginUser(req.body.email,req.body.password)

    // set refresh token in httpOnly cookie
    res.cookie(
        config.JWT.REFRESH_COOKIE_NAME,
        refreshToken,
        jwtService.getRefreshCookieOptions()
    )

    return res.status(200).json(new ApiResponse(200,"User logged in successfully",{
        user,accessToken
    }))
}


/**
 * @description Handle rerfesh token rqst, rotate the token and issue new Access/Rerfresh Token
 * refresh token is reterieved from HttpOnly cookie
 */
const refreshTokens = async(req,res)=>{
    // 
    const oldRefreshToken = req.cookies[config.JWT.REFRESH_COOKIE_NAME]
    if(!oldRefreshToken) throw new ApiResponse(401,"Refresh token missing",null)
    
    const {user,accessToken,refreshToken} = await authService.rotateRefreshToken(oldRefreshToken)

    // set new refresh token in httpOnly cookie
    res.cookie(
        config.JWT.REFRESH_COOKIE_NAME,
        refreshToken,
        jwtService.getRefreshCookieOptions()
    )

    return res.status(200).json(new ApiResponse(200,"Tokens refreshed successfully",{
        user,accessToken
    }))

}





export { refreshTokens, registerUser, loginUser };