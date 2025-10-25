import { Request, Response } from "express";
import prisma from "../prismaClient";

class GameController {
  // Word Hunt Game endpoints
  static async getWordHuntQuestions(req: Request, res: Response) {
    try {
      const { level } = req.query;
      let where: any = {};
      if (level) {
        const lv = String(level);
        where = { level: { in: [lv, lv.toUpperCase(), lv.toLowerCase()] } };
      }

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

  // Reading Game endpoints
  static async listReadingPassages(req: Request, res: Response) {
    try {
      const { level } = req.query as { level?: string };
      const where = level ? { level } : {};
      const passages = await (prisma as any).readingPassage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, level: true, createdAt: true },
      });
      res.json({ passages });
    } catch (error) {
      console.error("Error listing reading passages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getReadingPassage(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      if (!id) return res.status(400).json({ error: "id is required" });
      const passage = await (prisma as any).readingPassage.findUnique({
        where: { id },
        select: { id: true, title: true, text: true, level: true },
      });
      if (!passage) return res.status(404).json({ error: "not found" });
      const questions = await (prisma as any).readingQuestion.findMany({
        where: { passageId: id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          question: true,
          options: true,
          correctIndex: true,
          explanation: true,
        },
      });
      const formatted = questions.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation ?? undefined,
      }));
      res.json({ passage, questions: formatted });
    } catch (error) {
      console.error("Error fetching reading passage:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createReadingPassage(req: Request, res: Response) {
    try {
      const { title, text, level, questions } = req.body as {
        title: string;
        text: string;
        level?: string;
        questions: Array<{
          question: string;
          options: string[];
          correctIndex: number;
          explanation?: string;
        }>;
      };
      if (!title || !text || !questions || questions.length === 0) {
        return res
          .status(400)
          .json({ error: "title, text and questions are required" });
      }
      const created = await (prisma as any).readingPassage.create({
        data: {
          title,
          text,
          level: level || "A1",
          questions: {
            create: questions.map((q) => ({
              question: q.question,
              options: JSON.stringify(q.options),
              correctIndex: q.correctIndex,
              explanation: q.explanation || null,
            })),
          },
        },
        select: { id: true },
      });
      res.status(201).json({ id: created.id });
    } catch (error) {
      console.error("Error creating reading passage:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Writing Game endpoints
  static async getWritingQuestions(req: Request, res: Response) {
    try {
      const { level } = req.query;
      // Be robust to A1/a1 casing stored in DB
      let where: any = {};
      if (level) {
        const lv = String(level);
        where = { level: { in: [lv, lv.toUpperCase(), lv.toLowerCase()] } };
      }

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
      const { level } = req.query;
      let where: any = {};
      if (level) {
        const lv = String(level);
        where = { level: { in: [lv, lv.toUpperCase(), lv.toLowerCase()] } };
      }
      const questions = await prisma.paragraphQuestion.findMany({
        where,
        orderBy: { createdAt: "asc" }, // kolaydan zora (en eski en önce)
      });

      const formattedQuestions = questions.map((q) => ({
        id: q.id, // Tüm id'yi kullan
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

  // Word Matching Sets
  static async listWordMatchingSets(req: Request, res: Response) {
    try {
      const { level } = req.query as { level?: string };
      let where: any = {};
      if (level) {
        const lv = String(level);
        where = { level: { in: [lv, lv.toUpperCase(), lv.toLowerCase()] } };
      }
      const sets = await (prisma as any).wordMatchSet.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, level: true, createdAt: true },
      });
      res.json({ sets });
    } catch (error) {
      console.error("Error listing word matching sets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getWordMatchingSetItems(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      if (!id) return res.status(400).json({ error: "id is required" });
      const set = await (prisma as any).wordMatchSet.findUnique({
        where: { id },
      });
      if (!set) return res.status(404).json({ error: "set not found" });
      const items = await (prisma as any).wordMatchItem.findMany({
        where: { setId: id },
        orderBy: { createdAt: "asc" },
        select: { id: true, english: true, turkish: true },
      });
      res.json({
        set: { id: set.id, title: set.title, level: set.level },
        items,
      });
    } catch (error) {
      console.error("Error fetching word matching set:", error);
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
