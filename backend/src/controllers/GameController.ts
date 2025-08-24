import { Request, Response } from "express";
import prisma from "../prismaClient";

class GameController {
  // Word Hunt Game endpoints
  static async getWordHuntQuestions(req: Request, res: Response) {
    try {
      const { level } = req.query;
      const where = level ? { level: level as string } : {};

      const questions = await prisma.wordHuntQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const formattedQuestions = questions.map((q) => ({
        tr: q.turkish,
        en: [q.english, q.wrongOption],
        correct: q.english,
        alternatives: JSON.parse(q.alternatives),
      }));

      res.json(formattedQuestions);
    } catch (error) {
      console.error("Error fetching word hunt questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Writing Game endpoints
  static async getWritingQuestions(req: Request, res: Response) {
    try {
      const { level } = req.query;
      const where = level ? { level: level as string } : {};

      const questions = await prisma.writingQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      const formattedQuestions = questions.map((q) => ({
        tr: q.turkish,
        en: q.english,
      }));

      res.json(formattedQuestions);
    } catch (error) {
      console.error("Error fetching writing questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Paragraph Game endpoints (level-agnostic)
  static async getParagraphQuestions(req: Request, res: Response) {
    try {
      // Level is intentionally ignored to make the game level-less
      const questions = await prisma.paragraphQuestion.findMany({
        orderBy: { createdAt: "desc" },
      });

      const formattedQuestions = questions.map((q) => ({
        id: parseInt(q.id.slice(-1)), // Simple ID for frontend
        title: q.title,
        text: q.text,
        options: JSON.parse(q.options),
        correctAnswers: JSON.parse(q.correctAnswers),
      }));

      res.json(formattedQuestions);
    } catch (error) {
      console.error("Error fetching paragraph questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Create new questions (for admin)
  static async createWordHuntQuestion(req: Request, res: Response) {
    try {
      const { turkish, english, wrongOption, alternatives, level } = req.body;

      const question = await prisma.wordHuntQuestion.create({
        data: {
          turkish,
          english,
          wrongOption,
          alternatives: JSON.stringify(alternatives),
          level: level || "A1",
        },
      });

      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating word hunt question:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createWritingQuestion(req: Request, res: Response) {
    try {
      const { turkish, english, level } = req.body;

      const question = await prisma.writingQuestion.create({
        data: {
          turkish,
          english,
          level: level || "A1",
        },
      });

      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating writing question:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createParagraphQuestion(req: Request, res: Response) {
    try {
      const { title, text, options, correctAnswers } = req.body; // level removed

      const question = await prisma.paragraphQuestion.create({
        data: {
          title,
          text,
          options: JSON.stringify(options),
          correctAnswers: JSON.stringify(correctAnswers),
          // Persist a default level only to satisfy schema; not used anywhere
          level: "A1",
        },
      });

      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating paragraph question:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default GameController;
