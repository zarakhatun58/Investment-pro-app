import { Router } from "express";

const router =
    Router();

import auth from "../middleware/auth.js";

import { getDashboard } from "../controllers/dashboardController.js";

router.get(
    "/",
    auth,
    getDashboard
);
export default router;