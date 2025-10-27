import express from "express";
import EssayController from "../controllers/EssayController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Essay evaluation endpoint (no auth required)
router.post("/evaluate", EssayController.evaluate);

// Health check endpoint
router.get("/health", EssayController.healthCheck);

export default router;
