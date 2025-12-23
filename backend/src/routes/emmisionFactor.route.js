// This router handles the CRUD operations for the EmissionFactor collection, strictly for administrators.
// /routes/emissionFactor.routes.js

import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";

import { 
    createFactorSchema, 
    updateFactorSchema,

} from "../validators/emmisionFactor.validator.js"; 

// Import Controllers
import { 
    createFactor, 
    getAllFactors, 
    updateFactor, 
    deleteFactor 
} 
from "../controllers/emissionFactor.controller.js";
import { USER_ROLES } from "../constants/index.js";

const factorRouter = Router();

// Ensure all factor management routes are protected and restricted to ADMIN role
factorRouter.use(isAuth, hasRole([USER_ROLES.ADMIN]));

// --- ADMIN Emission Factor Endpoints ---

// POST: /api/v1/factors
// ----------------------------------------------------
// Creates a new Emission Factor. Essential for initial setup and adding new factor types.
factorRouter.post(
    "/",
    validate(createFactorSchema),
    asyncHandler(createFactor)
);

// GET: /api/v1/factors
// ----------------------------------------------------
// Retrieves the full list of all active Emission Factors.
factorRouter.get(
    "/",
    asyncHandler(getAllFactors)
);

// PUT: /api/v1/factors/:factorId
// ----------------------------------------------------
// Updates an existing Emission Factor's value, source, or region.
factorRouter.put(
    "/:factorId",
    validate(updateFactorSchema), // Validation for update body
    asyncHandler(updateFactor)
);

// DELETE: /api/v1/factors/:factorId
// ----------------------------------------------------
// Deletes an Emission Factor.
factorRouter.delete(
    "/:factorId",
    asyncHandler(deleteFactor)
);

export { factorRouter };