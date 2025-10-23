import { Router } from "express";
import { getFeatureFlags } from "../utils/features";

const router = Router();

// GET /api/features -> returns feature flags for clients
router.get("/", (req, res) => {
  const flags = getFeatureFlags();
  res.json({ flags });
});

export default router;
