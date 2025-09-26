import { Router } from "express";
import TopicsController from "../controllers/TopicsController";

const router = Router();

// Basic index to verify router is mounted
router.get("/", (req, res) => {
  res.json({ ok: true, endpoints: ["/preview"] });
});

router.get("/preview", TopicsController.preview);

export default router;
