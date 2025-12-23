// /services/footprint.service.js

import { calculationService } from "./calculation.service.js";
import { emissionFactorRepository } from "../repositories/emissionFactor.repository.js";
import { footprintLogRepository } from "../repositories/footprintLog.repository.js";
import { ApiError } from "../utils/apiError.utils.js";
import {redisClient} from "../config/redis.js"
/**
 * @class FootprintService
 * @description Manages the lifecycle of user carbon footprint data: calculation, logging, and history retrieval.
 * This class orchestrates calls between Repositories and the Calculation Engine.
 */
class FootprintService {
  /**
   * @description Calculates a new footprint, logs the result, and updates the Redis leaderboard.
   * This is the core logic behind the POST /api/v1/footprints/calculate endpoint.
   * @param {string} userId - ID of the authenticated user.
   * @param {Object} activityData - Validated user input data (kWh, km, spend, kg).
   * @returns {Promise<Object>} - Returns the created log document's ID and results.
   */
  async createFootprintLog(userId, activityData) {
    // --- 1. Fetch Emission Factors ---
    // Get the current set of factors needed for calculation.
    const factors = await emissionFactorRepository.getAllActiveFactors();
    console.log("factors: ", factors);
    if (!factors || factors.length === 0) {
      // Failsafe: If no factors are in the DB, the calculation cannot run.
      throw new ApiError(
        500,
        "Calculation environment not ready: No emission factors found."
      );
    }

    // --- 2. Run Calculation Engine ---
    let calculatedResults;
    try {
      calculatedResults = calculationService.calculate(activityData, factors);
    } catch (error) {
      // Catch any errors from the calculation service (e.g., critical math errors)
      throw new ApiError(500, `Calculation failed: ${error.message}`);
    }

    // --- 3. Prepare Log Data ---
    // Automatically determine the period (e.g., "2025-12")
    const period = new Date().toISOString().substring(0, 7);

    const logData = {
      userId,
      period,
      activityData,
      results: calculatedResults,
    };

    // --- 4. Persist to MongoDB ---
    const newLog = await footprintLogRepository.createLog(logData);

    // --- 5. Update Redis Leaderboard (using ZSET) ---
    try {
      // ZADD: Update the user's latest total_co2e score in the global leaderboard set.
      // This allows the Admin Dashboard to instantly fetch top/bottom performers.
      await redisClient.zAdd("global_footprints", {
        score: newLog.results.total_co2e,
        value: userId.toString(),
      });
    } catch (redisError) {
      console.error(
        `Failed to update Redis leaderboard for user ${userId}:`,
        redisError
      );
      // Note: A Redis error should not stop the core function (saving the log) from succeeding.
    }

    // --- 6. Return Clean Output ---
    return {
      logId: newLog._id,
      period,
      results: newLog.results,
      dateCalculated: newLog.dateCalculated,
    };
  }

  /**
   * @description Retrieves the full historical log for a single user for display on the dashboard.
   * @param {string} userId - ID of the user whose history is requested.
   * @returns {Promise<Array<Object>>} - An array of simplified FootprintLog history objects.
   */
  async getHistoryByUserId(userId) {
    // The repository is responsible for fetching, sorting, and selecting clean fields.
    const history = await footprintLogRepository.findByUserId(userId);
    if (!history || history.length === 0) {
      throw new ApiError(
        404,
        "No footprint history found for this user. Please add some data first."
      );
    }
    return history;
  }

  /**
   * @description Retrieves detailed data for a specific footprint log entry.
   * @param {string} logId - ID of the specific log document.
   * @param {string} userId - ID of the owning user for security check.
   * @returns {Promise<Object|null>} - The detailed log document or null if not found/unauthorized.
   */
  async getLogDetails(logId, userId) {
    const log = await footprintLogRepository.findByIdAndUser(logId, userId);

    if (!log) {
      throw new ApiError(
        404,
        "Footprint log not found. Please Provide valid log ID."
      );
    }

    // Return the Mongoose object directly (the controller will strip unnecessary fields if needed)
    return log;
  }

  async getUserAnalytics(userId) {
    const analytics = await footprintLogRepository.getMonthlyAnalytics(userId);

    if (!analytics || analytics.length === 0) {
      throw new ApiError(
        404,
        "No footprint data found for analytics. Please add some data first."
      );
    }
    return analytics;
  }
}

export const footprintService = new FootprintService();
