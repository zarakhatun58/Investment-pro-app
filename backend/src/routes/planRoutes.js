import { Router } from "express";

const router = Router();

import auth from "../middleware/auth.js";

import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";

router.post(
  "/",
  auth,
  createPlan
);

router.get(
  "/",
  auth,
  getPlans
);

router.get(
  "/:id",
  auth,
  getPlanById
);

router.put(
  "/:id",
  auth,
  updatePlan
);

router.delete(
  "/:id",
  auth,
  deletePlan
);

export default router;