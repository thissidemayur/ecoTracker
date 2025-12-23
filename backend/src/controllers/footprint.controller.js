// /controllers/footprint.controller.js

import { footprintService } from "../services/footprint.service.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js"; // Assuming you have a standard response wrapper

/**
 * @function createFootprint
 * @description Handles the POST request to calculate, log, and update a user's carbon footprint.
 * @route POST /api/v1/footprints/calculate
 * @access Private (User)
 */
export const createFootprint = async (req, res) => {
  // 1. Get validated data and user ID
  // req.user.id is populated by the isAuth middleware
  const userId = req.user.id;
  // req.body.activityData is guaranteed to be clean due to the Zod validation middleware
  const { activityData } = req.body;
  console.log("Activity Data: ",activityData)
  console.log("req.body",req.body)

  // 2. Call the Service Orchestrator
  const { logId, results, period, dateCalculated } =
    await footprintService.createFootprintLog(userId, activityData);

  // 3. Send successful response
  return res.status(201).json(
    new ApiResponse(
      201,
      "Carbon footprint calculated, logged, and leaderboard updated successfully.",
      {
        logId,
        period,
        dateCalculated,
        results
      }
    )
  );
};

/**
 * @function getUserFootprintHistory
 * @description Handles the GET request to retrieve all historical footprints for the authenticated user.
 * @route GET /api/v1/footprints/history
 * @access Private (User)
 */
export const getUserFootprintHistory = async (req, res) => {
  const userId = req.user.id;

  // 1. Call the Service to retrieve history
  const history = await footprintService.getHistoryByUserId(userId);

  // 2. Send successful response
  if (history.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "No historical footprint data found for this user.",
          [],
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User footprint history retrieved successfully.",
        history,
      )
    );
};

/**
 * @function getFootprintLogById
 * @description Handles the GET request to retrieve detailed data for a single log entry.
 * @route GET /api/v1/footprints/:logId
 * @access Private (User)
 */
export const getFootprintLogById = async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);
  const logId = req.params.logId;

  // 1. Call the Service to retrieve details (service includes authorization check)
  const logDetails = await footprintService.getLogDetails(logId, userId);

  // The service throws ApiError(404) if not found/unauthorized,
  // which is caught by the asyncHandler wrapper.

  // 2. Send successful response with detailed log
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Footprint log details retrieved successfully.",
        logDetails,
      )
    );
};


export const getAnalytics = async (req, res) => {
  const userId = req.user.id; 

  const analyticsData = await footprintService.getUserAnalytics(userId);

  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Monthly analytics fetched successfully.",
    data: analyticsData,
    errors: [],
  });
};

