import { Router } from "express";
import WordsController from "../controllers/WordsController";

const router = Router();

router.get("/", WordsController.getWords);
router.post("/", WordsController.createWord);
router.get("/:id/examples", WordsController.getExamples);

export default router;
