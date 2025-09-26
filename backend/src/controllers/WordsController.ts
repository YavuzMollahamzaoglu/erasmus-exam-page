import { Request, Response } from "express";
import prisma from "../prismaClient";

const WordsController = {
  // GET /api/words?level=A1&categoryId=1&limit=50
  getWords: async (req: Request, res: Response) => {
    try {
      const { level, categoryId, limit } = req.query as {
        level?: string;
        categoryId?: string;
        limit?: string;
      };
      const where: any = {};
      if (level && ["A1", "A2", "B1", "B2"].includes(level))
        where.level = level;
      if (categoryId) where.categoryId = Number(categoryId);

      const take = limit
        ? Math.max(1, Math.min(200, Number(limit)))
        : undefined;

      const words = await prisma.word.findMany({
        where,
        orderBy: { createdAt: "asc" },
        take,
        select: {
          id: true,
          english: true,
          turkish: true,
          example: true,
          level: true,
          categoryId: true,
        },
      });
      res.json({ words });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch words" });
    }
  },

  // Optional: POST /api/words  (for seeding via API if needed)
  createWord: async (req: Request, res: Response) => {
    try {
      const { english, turkish, example, level, categoryId } = req.body;
      if (!english || !turkish) {
        return res
          .status(400)
          .json({ error: "english and turkish are required" });
      }
      const word = await prisma.word.create({
        data: {
          english,
          turkish,
          example: example || null,
          level:
            level && ["A1", "A2", "B1", "B2"].includes(level) ? level : "A1",
          categoryId: categoryId ? Number(categoryId) : null,
        },
      });
      res.status(201).json({ word });
    } catch (error) {
      res.status(500).json({ error: "Failed to create word" });
    }
  },

  // GET /api/words/:id/examples  -> returns array of example sentences from DB
  getExamples: async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) return res.status(400).json({ error: "id is required" });

      const word = await prisma.word.findUnique({ where: { id } });
      if (!word) return res.status(404).json({ error: "word not found" });

      const extras = await prisma.wordExample.findMany({
        where: { wordId: id },
        orderBy: { createdAt: "asc" },
        select: { id: true, sentence: true },
      });

      // Build unique, normalized sentence list (avoid duplicates)
      const seen = new Set<string>();
      const out: string[] = [];
      const norm = (s: string) =>
        s
          .trim()
          .replace(/\s+/g, " ")
          .replace(/[.!?]+$/g, "")
          .toLowerCase();

      const pushUnique = (s?: string | null) => {
        if (!s) return;
        const trimmed = s.trim();
        if (!trimmed) return;
        const key = norm(trimmed);
        if (seen.has(key)) return;
        seen.add(key);
        out.push(trimmed);
      };

  // Only include extra examples; avoid repeating the card's base example in the dialog
  for (const ex of extras) pushUnique(ex.sentence);

  res.json({ wordId: id, sentences: out });
    } catch (error) {
      console.error("getExamples error", error);
      res.status(500).json({ error: "Failed to fetch examples" });
    }
  },
};

export default WordsController;
