import { Request, Response } from "express";
import { RankingsRepository } from "../repositories/RankingsRepository";

const RankingsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const exam = (req.query.exam as string | undefined)?.toUpperCase();
      const type = (req.query.type as string | undefined) || undefined; // Erasmus | Genel | Hazırlık
      const validLevel =
        exam && ["A1", "A2", "B1", "B2"].includes(exam) ? exam : undefined;
      const rankings = await RankingsRepository.getAll(validLevel, type);
      res.json({ rankings });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch rankings" });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      // Get userId from authenticated user
      const userId = req.user?.userId;
      const { score, time, categoryId, seriesId, correct, mistakes } = req.body;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      if (!categoryId || !seriesId) {
        return res
          .status(400)
          .json({ error: "categoryId and seriesId are required" });
      }
      const ranking = await RankingsRepository.create({
        userId,
        score,
        time,
        categoryId,
        seriesId,
        correct,
        mistakes,
      });
      res.json({ ranking });
    } catch (err) {
      res.status(500).json({ error: "Failed to create ranking" });
    }
  },
};

export default RankingsController;
