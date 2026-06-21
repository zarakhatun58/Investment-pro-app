import { Router } from "express";

const router =
    Router();

import auth from "../middleware/auth.js";

import { directReferrals, getReferralIncomeHistory, referralTree } from "../controllers/referralController.js";

router.get(
    "/direct",
    auth,
    directReferrals
);

router.get(
    "/tree",
    auth,
    referralTree
);

router.get(
    "/referral-income",
    auth,
    getReferralIncomeHistory
);

export default router;