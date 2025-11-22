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
};

export default WordsController;

// Add getExamples handler to support route GET /api/words/:id/examples
// This was missing and caused the server to crash during startup when the route
// referenced an undefined handler. Implementing it here returns examples for a
// given word id.
// NOTE: keep as separate named function to preserve existing default export shape
export async function getExamples(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    if (!id) return res.status(400).json({ error: 'id is required' });
    const examples = await prisma.wordExample.findMany({
      where: { wordId: id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, sentence: true, translation: true },
    });
    res.json({ examples });
  } catch (error) {
    console.error('Error fetching word examples:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
