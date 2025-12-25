// /routes/index.js

import { Router } from "express";
import { authRouter } from "./auth.route.js";
import { userRouter } from "./user.route.js";
import { footprintRouter } from "./footprint.routes.js";
import {adminRouter} from "./admin.route.js"
import { healthCheckRouter } from "./healthCheck.js";
const router = Router();

// --- Public / Auth Routes ---
// Base URL: /api/v1/auth
router.use("/auth", authRouter);

// --- User Profile Routes ---
// Base URL: /api/v1/users
router.use("/users", userRouter);

// --- Core Application Routes (User Footprint) ---
// Base URL: /api/v1/footprints
router.use("/footprints", footprintRouter);

// --- Admin Analytics Routes ---
// Base URL: /api/v1/admin
router.use("/admin", adminRouter);




// --- Health Check Route ---
// Base URL: /api/v1/health
router.use(healthCheckRouter)
export default router;
