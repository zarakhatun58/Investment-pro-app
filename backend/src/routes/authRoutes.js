import { Router } from "express";
const router = Router();

import { register, login,getProfile } from "../controllers/authController.js";
import authLimiter from "../middleware/rateLimiter.js";
import { registerValidator } from "../validators/authValidator.js";
import validate from "../middleware/validate.js";

router.post("/register",registerValidator,validate, register);
router.post("/login",authLimiter, login);
router.get(
  "/profile",
  authLimiter,
  getProfile
);

export default router;