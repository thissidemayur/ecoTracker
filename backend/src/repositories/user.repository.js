// /repositories/user.repository.js

import { User } from "../models/User.js";

/**
 * @class UserRepository
 * @description Provides database abstraction for the User model, centralizing all User-related Mongoose queries.
 */
class UserRepository {
  /**
   * @description Find user by email
   * @params {string} email - email of the user to find
   * @params {boolean} includePassword - whether to include password in result
   * @returns {Promise<User|null>} - returns user document if found, else null
   */
  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email });
    if (includePassword) {
      query = query.select("+password");
    }
    return await query;
  }

  /** * @description Find user by ID
   * @params {string} userId - ID of the user to find
   * @returns {Promise<User|null>} - returns user document if found, else null
   */
  async findById(userId) {
    const user = User.findById(userId).select("-password -refreshTokenHash");
    return await user;
  }

  // Add this to your UserRepository class
  async findByIdWithPassword(userId) {
    // We return the actual document after awaiting the query
    return await User.findById(userId).select("+password");
  }

  /** * @description Finds multiple users by an array of IDs. Required for enhancing leaderboard data.
   * @params {Array<string>} userIds - Array of user IDs to find.
   * @returns {Promise<Array<User>>} - Returns an array of User documents.
   */
  async findUsersByIds(userIds) {
    // $in operator finds documents where the _id field value is in the specified array.
    return await User.find({ _id: { $in: userIds } });
  }

  /** *
   * @description Create a new user
   * @params {Object} userData - data for the new user
   * @returns {Promise<User>} - returns the created user document
   */
  async create(userData) {
    return await User.create(userData);
  }

  /** * @description Updates a user's profile details. Used for profile updates and admin validation.
   * @params {string} userId - ID of the user to update.
   * @params {Object} updateData - Data to update (e.g., username, region, isVerified).
   * @returns {Promise<User|null>} - returns the updated user document or null if user not found.
   */
  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated document and run Mongoose validation
    ).select("-password -refreshTokenHash"); // Exclude sensitive fields on return
  }

  /** * @description Counts the total number of users in the database. Required for global metrics in Admin Dashboard.
   * @returns {Promise<number>} - The total count of user documents.
   */
  async countAllUsers() {
    return await User.countDocuments({});
  }

  /** * @description update user's refeshToken hash in DB
   * @params {string} userId - ID of the user to update
   * @params {string|null} refreshTokenHash - new refreshToken hash (or null to logout)
   * @returns {Promise<User|null>} - returns the updated user document
   */
  async updateRefreshTokenHash(userId, refreshTokenHash) {
    return await User.findByIdAndUpdate(
      userId,
      { refreshTokenHash },
      { new: true, runValidators: true }
    );
  }

  async findByIdWithRefreshToken(userId) {
    // We execute the query here and return the document
    return await User.findById(userId).select("+refreshTokenHash");
  }
}

export const userRepository = new UserRepository();
