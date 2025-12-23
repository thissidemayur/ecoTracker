// /controllers/admin.controller.js

import { adminService } from "../services/admin.service.js";

import { ApiResponse } from "../utils/apiResponse.utils.js";

/**
 * @function getGlobalSummary
 * @description Handles the GET request for high-level global dashboard metrics.
 * @route GET /api/v1/admin/summary
 * @access Private (Admin)
 */
export const getGlobalSummary = async (req, res) => {
  // 1. Call the Service to gather all summarized data (DB aggregation and Redis leaderboard lookups)
  const summaryData = await adminService.fetchGlobalDashboardData();

  // 2. Send successful response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        summaryData,
        "Global dashboard summary retrieved successfully."
      )
    );
  //
};

/**
 * @function getAggregatedFootprints
 * @description Handles the GET request for detailed, filterable footprint logs for pattern analysis.
 * @route GET /api/v1/admin/footprints?filter=...
 * @access Private (Admin)
 */
export const getAggregatedFootprints = async (req, res) => {
  // 1. Query parameters are already validated by Zod middleware in the route.
  const queryOptions = req.query;

  // 2. Call the Service to fetch filtered and paginated logs
  const logs = await adminService.getAggregatedFootprints(queryOptions);

  // 3. Send successful response
  if (logs.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          [],
          "No footprint logs found matching the specified filters."
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        logs,
        "Aggregated footprint logs retrieved for analysis."
      )
    );
};

/**
 * @function validateUserAccount
 * @description Allows an administrator to validate a user account (e.g., mark as verified).
 * @route POST /api/v1/admin/users/:userId/validate
 * @access Private (Admin)
 */
export const validateUserAccount = async (req, res) => {
  // 1. Get user ID from URL parameters
  const { userId } = req.params;

  // 2. Call the Service to perform the update
  const updatedUser = await adminService.validateUserAccount(userId);

  // The service handles the 404 error if the user ID is invalid.

  // 3. Send successful response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          userId: updatedUser._id,
          isVerified: updatedUser.isVerified,
          email: updatedUser.email,
        },
        `User ${userId} has been successfully validated.`
      )
    );
};
