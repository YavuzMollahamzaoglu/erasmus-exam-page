import { Router } from "express";
import WordsController, { getExamples } from "../controllers/WordsController";

const router = Router();

router.get("/", WordsController.getWords);
router.post("/", WordsController.createWord);
router.get("/:id/examples", getExamples);

export default router;
