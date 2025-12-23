import { jwtService } from "./jwt.service.js";
import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/apiError.utils.js";
import { bcryptService } from "./bcrypt.service.js";

class AuthService {
  // Create user
  /**
   * @description Registers a new user
   * @params {Object} userData{email,password,role,username} - data for the new user
   * @returns {Promise<User>} - returns the created user document
   */
  async registerUser({ email, password, role = "user",username=null }) {
    const existingUser =await userRepository.findByEmail(email,false)
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    const hashedPassowrd = await bcryptService.hash(password)
    const newUser = await userRepository.create({email, password: hashedPassowrd, role, username});

    // generate new tokens
    const tokens = await this.generateAndSaveTokens(newUser)

    // return a clean user object without password and refreshTokenHash
    const userDto = newUser.toObject();
    delete userDto.password;
    delete userDto.refreshTokenHash;

    return {user:userDto, ...tokens}
  }

  /**
   * @description Logs a user in and issues tokens
   * @params {string} email - email of the user
   * @params {string} password - password of the user
   * @returns {Promise<Object>} - returns user info along with access and refresh tokens
   */
  async loginUser(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcryptService.compare(password,user.password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid email or password")
    }

    // generate tokens
    const tokens = await this.generateAndSaveTokens(user)

    // return a clean user object without password and refreshTokenHash
    const userDto = user.toObject();
    delete userDto.password;
    delete userDto.refreshTokenHash;

    return {user:userDto, ...tokens}
  }


  /**
   * @description Genereate new access and refresh tokens, hashes the refresh token and save in DB
   * @params {User} user - Mongoose user document
   * @return {Promise<Object>} genereated {accessToken, accessTokenExpire, refreshToken}
   */
  async generateAndSaveTokens(user) {
    const tokenPayload = {
      userId:user._id,
      role:user.role
    }

    // genereate tokens (Access and refresh)
    const { token: accessToken, expiresIn: accessTokenExpire } = jwtService.generateToken(tokenPayload,"access")
    const {token:refreshToken,expiresIn:refershTokenexpire} = jwtService.generateToken(tokenPayload,"refresh")

    //  create refreshToken hash  and save in db
    const refreshTokenHash = await bcryptService.hash(refreshToken)
    await userRepository.updateRefreshTokenHash(user._id, refreshTokenHash)

    
    return {
      accessToken,
      accessTokenExpire,
      refreshToken
    }
  }

  /**
   * @description: refreshing tokens with rotating and reuse detection
   * @params {string} oldRefreshToken - refresh token sent by client
   * @return {Promise<object>} - new access , refresh tokens and user info with userId and role
   * */
  async rotateRefreshToken(oldRefreshToken) {
    // verify old refresh token
    let decodedPayload;
    try {
      decodedPayload = jwtService.verifyToken(oldRefreshToken, "refresh");
    } catch (error) {
      throw error;
    }
    console.log("Decoded Payload:", decodedPayload);

    const { userId, role } = decodedPayload;

    // find the user
    const user =await userRepository.findByIdWithRefreshToken(userId)
    console.log("User from DB:", user);
    if (!user || !user.refreshTokenHash) {
      throw new ApiError(401, "Invalid session. Please login again.");
    }

    // compare the hash of old refresh token with stored hash- to detect reuse
    const isMatch = await bcryptService.compare(
      oldRefreshToken,
      user.refreshTokenHash
    );

    if (!isMatch) {
      console.warn(
        `[SECURITY BREACH DETECTED ] for user ID ${userId}. Invalidating all sessions`
      );

      // invalidate all sessions
      await userRepository.updateRefreshTokenHash({
        userId: user._id,
        refreshTokenHash: null,
      });

      //force user to login
      throw new ApiError(401, "Session compromised. Re-login required.");
    }

    // generate new tokens
    const token = await this.generateAndSaveTokens(user);

    // return access and refresh tokens
    return {
      user: { userId, role },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessTokenExpire: token.accessTokenExpire,
    };
  }


  /**   *
   *  @description logout user by clearing refresh token
   * @params {string} userId - ID of the user to logout
   * */
  async logoutUser(userId) {
    await userRepository.updateRefreshTokenHash(userId,null);
  }

  

}

export const authService = new AuthService()