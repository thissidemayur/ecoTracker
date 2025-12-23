import { config } from "../config/index.js";
import  {v4 as uuidv4} from "uuid"
import jwt from "jsonwebtoken"


class JWTService {
  constructor() {
    this.ACCESS_SECRET = config.JWT.ACCESS_SECRET;
    this.REFRESH_SECRET = config.JWT.REFRESH_SECRET;
    this.ACCESS_EXPIRY = config.JWT.ACCESS_EXPIRY;
    this.REFRESH_EXPIRY = config.JWT.REFRESH_EXPIRY;
  }


  /**
   * @description generate JWT (access or refresh)
   * @params {Object} payload - data to be stored in token
   * @params {string} type - 'access' or 'refresh'
   * @return- {token:string, expiresIn:string}; we return expiresIn to help the client know when to refresh
   * */
  generateToken(payload, type) {
    const secret = type === "access" ? this.ACCESS_SECRET : this.REFRESH_SECRET;
    const expiresIn =
      type === "access" ? this.ACCESS_EXPIRY : this.REFRESH_EXPIRY;
    // add required jwt claims for
    const tokenPayload = {
      ...payload,
      type: type,
      ...(type === "refresh" && { jti: uuidv4() }),
    };

    // create token
    const token = jwt.sign(tokenPayload, secret, { expiresIn });
    return { token, expiresIn };
  }


  /**
   * @description verify JWT (access or refresh) throw error if invalid/expired
   * @params {string} token - JWT token to verify
   * @params {string} type - 'access' or 'refresh'
   * @return- {Object} decoded payload if valid, else throws error
   */
  verifyToken(token, type) {
   
    const secret = type === "access" ? this.ACCESS_SECRET : this.REFRESH_SECRET;
    const decodedToken = jwt.verify(token,secret)
    if (decodedToken.type !== type) {
        throw new jwt.JsonWebTokenError("Invalid token type")
    }
    return decodedToken

  }


  /**
   * @description get cookie  cookie options for refresh token
    * @return- {Object} cookie options
 */
   getRefreshCookieOptions() {
       const sevenDaysInMs = 7*24*60*60*1000;

       return {
         httpOnly:true, //prevent client side XSS attacks
         secure : config.NODE_ENV==="production", // send cookie only over https in production
         sameSite:"Lax", // prevent CSRF attacks on GET/HEAD requests,
         maxAge: sevenDaysInMs,
         path:"/" // cookie only sent to this path
       }
   }


   /**
    * @description getCookieOption for clearing refresh token
    * @return {object} cookie option for Exress 'res.clearCookie()
    */
   getClearCookieOptions() {
    return {
        httpOnly:true,
        secure : config.NODE_ENV==="production",
        sameSite:"Lax", 
        path:"/"
    }
   }

}

export const jwtService = new JWTService();