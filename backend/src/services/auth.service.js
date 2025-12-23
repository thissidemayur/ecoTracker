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


}

export const authService = new AuthService()