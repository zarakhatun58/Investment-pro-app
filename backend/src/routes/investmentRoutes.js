import { Router } from "express";

const router =
    Router();

import auth from "../middleware/auth.js";
import { createInvestment, getInvestments } from "../controllers/investmentController.js";

router.post(
"/",
auth,
createInvestment
);

router.get(
"/",
auth,
getInvestments
);

export default router;