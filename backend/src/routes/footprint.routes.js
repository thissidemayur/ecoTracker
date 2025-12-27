// This router handles the core interaction: saving new footprint data and retrieving the user's history.
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createFootprintBodySchema } from "../validators/footprint.validator.js";
// Import Controllers
import {
  createFootprint,
  getUserFootprintHistory,
  getFootprintLogById,
  getAnalytics,
} from "../controllers/footprint.controller.js";
import { USER_ROLES } from "../constants/index.js";

const footprintRouter = Router();

// --- USER Endpoints (Requires Auth and User Role) ---

// POST: /api/v1/footprints/calculate
// ----------------------------------------------------
// Calculates a user's carbon footprint based on activity data,
// logs the result to MongoDB, and updates the user's latest score in Redis.
footprintRouter.post(
  "/calculate",
  isAuth,
  hasRole([USER_ROLES.USER,USER_ROLES.ADMIN]),
  validate(createFootprintBodySchema), 
  asyncHandler(createFootprint)
);

// GET: /api/v1/footprints/history
// ----------------------------------------------------
// Retrieves all past FootprintLogs for the authenticated user,
// ordered by date, for displaying history charts.
footprintRouter.get(
  "/history",
  isAuth,
  hasRole([USER_ROLES.USER,USER_ROLES.ADMIN]),
  asyncHandler(getUserFootprintHistory)
);

// GET: /api/v1/footprints/analytics
// ----------------------------------------------------
// Retrieves aggregated analytics data for the user dashboard,
footprintRouter.get("/analytics", isAuth, hasRole([USER_ROLES.USER,USER_ROLES.ADMIN]), asyncHandler(getAnalytics) )


// GET: /api/v1/footprints/:logId
// ----------------------------------------------------
// Retrieves detailed data for a specific footprint log entry.
// Used when a user clicks on a chart point or history entry.
footprintRouter.get(
  "/:logId",
  isAuth,
  hasRole([USER_ROLES.USER,USER_ROLES.ADMIN]),
  asyncHandler(getFootprintLogById)
);




export { footprintRouter };
