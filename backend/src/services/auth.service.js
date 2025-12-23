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


}

export const authService = new AuthService()