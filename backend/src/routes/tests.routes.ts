import { Router } from "express";
import TestsController from "../controllers/TestsController";
const router = Router();

router.get("/:id", TestsController.getTest);
router.get("/:id/questions", TestsController.getQuestionsBySeries);
router.post("/:id/submit", TestsController.submit);
router.get("/:id/result", TestsController.result);

// Erasmus question endpoints
router.get("/a1-erasmus/questions", TestsController.getA1ErasmusQuestions);
router.get("/a2-erasmus/questions", TestsController.getA2ErasmusQuestions);
router.get("/b1-erasmus/questions", TestsController.getB1ErasmusQuestions);
router.get("/b2-erasmus/questions", TestsController.getB2ErasmusQuestions);

export default router;
