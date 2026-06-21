import express from "express";
import auth from "../middleware/auth.js";
import { getROIHistory } from "../controllers/roiController.js";

const router = express.Router();

router.get("/", auth, getROIHistory);

export default router;