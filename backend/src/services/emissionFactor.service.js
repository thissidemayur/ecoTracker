// /services/emissionFactor.service.js

import { emissionFactorRepository } from "../repositories/emissionFactor.repository.js";
import { ApiError } from "../utils/apiError.utils.js";

/**
 * @class EmissionFactorService
 * @description Manages the business logic for Emission Factors, including CRUD operations
 * and handling cache synchronization (Admin functionality).
 */
class EmissionFactorService {
  /**
   * @description Creates a new Emission Factor.
   * @param {Object} factorData - Data for the new factor.
   * @returns {Promise<Object>} - The created factor document.
   */
  async createFactor(factorData) {
    // Optional: Check if a factor with the same factorId already exists before creating.
    const existingFactor = await emissionFactorRepository.findById(
      factorData.factorId
    );
    if (existingFactor) {
      throw new ApiError(
        409,
        `Emission Factor with ID '${factorData.factorId}' already exists.`
      );
    }

    const newFactor = await emissionFactorRepository.createFactor(factorData);



    return newFactor;
  }

  /**
   * @description Retrieves all active Emission Factors.
   * @returns {Promise<Array<Object>>} - Array of all factor documents.
   */
  async getAllFactors() {
    // In the future, this is where we would implement read-through caching.

    /*
        // Example Cache logic:
        const cachedFactors = await redisClient.get('all_emission_factors_cache');
        if (cachedFactors) {
            return JSON.parse(cachedFactors);
        }
        */

    const factors = await emissionFactorRepository.getAllActiveFactors();

    /*
        // Set the cache if retrieved from DB
        await redisClient.set('all_emission_factors_cache', JSON.stringify(factors), { EX: 3600 });
        */

    return factors;
  }

  /**
   * @description Updates an existing Emission Factor.
   * @param {string} factorId - The ID of the factor to update.
   * @param {Object} updateData - Data to apply (e.g., new value, new source).
   * @returns {Promise<Object>} - The updated factor document.
   */
  async updateFactor(factorId, updateData) {
    const updatedFactor = await emissionFactorRepository.updateFactor(
      factorId,
      updateData
    );

    if (!updatedFactor) {
      throw new ApiError(
        404,
        `Emission Factor with ID '${factorId}' not found.`
      );
    }

    // --- Cache Synchronization ---
    // Invalidation is crucial here, as any change affects all subsequent calculations.
    // await redisClient.del('all_emission_factors_cache');

    return updatedFactor;
  }

  /**
   * @description Deletes an existing Emission Factor.
   * @param {string} factorId - The ID of the factor to delete.
   * @returns {Promise<boolean>} - True on successful deletion.
   */
  async deleteFactor(factorId) {
    const deleted = await emissionFactorRepository.deleteFactor(factorId);

    if (!deleted) {
      throw new ApiError(
        404,
        `Emission Factor with ID '${factorId}' not found.`
      );
    }


    return deleted;
  }
}

export const emissionFactorService = new EmissionFactorService();
