// /controllers/emissionFactor.controller.js

import { emissionFactorService } from "../services/emissionFactor.service.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

/**
 * @function createFactor
 * @description Handles the POST request to create a new Emission Factor.
 * @route POST /api/v1/factors
 * @access Private (Admin)
 */
export const createFactor = async (req, res) => {
  // req.body is already validated by Zod middleware
  const factorData = req.body;

  // 1. Call the Service to create the factor (Service handles existence check)
  const newFactor = await emissionFactorService.createFactor(factorData);

  // 2. Send successful response
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Emission Factor created successfully.",newFactor)
    );
};

/**
 * @function getAllFactors
 * @description Handles the GET request to retrieve all existing Emission Factors.
 * @route GET /api/v1/factors
 * @access Private (Admin)
 */
export const getAllFactors = async (req, res) => {
  // 1. Call the Service to retrieve all factors
  const factors = await emissionFactorService.getAllFactors();

  // 2. Send successful response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All Emission Factors retrieved successfully.",
        factors,
      )
    );
};

/**
 * @function updateFactor
 * @description Handles the PUT request to update an existing Emission Factor.
 * @route PUT /api/v1/factors/:factorId
 * @access Private (Admin)
 */
export const updateFactor = async (req, res) => {
  // 1. Get factorId from URL parameters and update data from body
  const { factorId } = req.params;
  // req.body is already validated by Zod
  const updateData = req.body;

  // 2. Call the Service to update the factor (Service handles 404 check)
  const updatedFactor = await emissionFactorService.updateFactor(
    factorId,
    updateData
  );

  // 3. Send successful response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Emission Factor ${factorId} updated successfully.`,
        updatedFactor,
      )
    );
};

/**
 * @function deleteFactor
 * @description Handles the DELETE request to remove an Emission Factor.
 * @route DELETE /api/v1/factors/:factorId
 * @access Private (Admin)
 */
export const deleteFactor = async (req, res) => {
  // 1. Get factorId from URL parameters
  const { factorId } = req.params;

  // 2. Call the Service to delete the factor (Service handles 404 check)
  await emissionFactorService.deleteFactor(factorId);

  // 3. Send successful response (No content needed, but 200/204 is appropriate)
  return res
    .status(200) // Using 200 for clarity, 204 No Content is also common
    .json(
      new ApiResponse(
        200,
        null,
        `Emission Factor ${factorId} deleted successfully.`
      )
    );
};
