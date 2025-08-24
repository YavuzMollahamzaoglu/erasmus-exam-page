import { Router } from "express";
import GameController from "../controllers/GameController";

const router = Router();

// Word Hunt Game routes
router.get("/word-hunt/questions", GameController.getWordHuntQuestions);
router.post("/word-hunt/questions", GameController.createWordHuntQuestion);

// Writing Game routes
router.get("/writing/questions", GameController.getWritingQuestions);
router.post("/writing/questions", GameController.createWritingQuestion);

// Paragraph Game routes
router.get("/paragraph/questions", GameController.getParagraphQuestions);
router.post("/paragraph/questions", GameController.createParagraphQuestion);

// Alias for Fill-in-the-Blanks (same as paragraph questions)
router.get(
  "/fill-in-the-blanks/questions",
  GameController.getParagraphQuestions
);
router.post(
  "/fill-in-the-blanks/questions",
  GameController.createParagraphQuestion
);

export default router;
