import { Router } from "express";
import HistoryController from "../controllers/HistoryController";
const router = Router();

import { authMiddleware } from "../middlewares/auth.middleware";

router.get("/", authMiddleware, HistoryController.getAll);
router.get("/:id", authMiddleware, HistoryController.getById);
router.post("/", authMiddleware, HistoryController.save);

export default router;
