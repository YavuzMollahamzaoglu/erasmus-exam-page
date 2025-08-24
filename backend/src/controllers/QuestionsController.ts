import { Request, Response } from "express";
import prisma from "../prismaClient";

const QuestionsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      // Test connection first
      await prisma.$queryRaw`SELECT 1`;

      const { categoryId, seriesId, category, series } = req.query;

      // Build where clause based on query parameters
      const where: any = {};

      if (categoryId) {
        where.categoryId = parseInt(categoryId as string);
      }

      if (seriesId) {
        where.seriesId = seriesId as string;
      }

      // Alternative: filter by category name
      if (category && !categoryId) {
        const categoryRecord = await prisma.category.findFirst({
          where: { name: { equals: category as string } },
        });
        if (categoryRecord) {
          where.categoryId = categoryRecord.id;
        }
      }

      // Alternative: filter by series name
      if (series && !seriesId) {
        const seriesRecord = await prisma.questionSeries.findFirst({
          where: { name: { contains: series as string } },
        });
        if (seriesRecord) {
          where.seriesId = seriesRecord.id;
        }
      }

      const questions = await prisma.question.findMany({
        where,
        include: {
          category: true,
          series: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      console.log(
        `✅ Found ${
          questions.length
        } questions in database (filters: ${JSON.stringify(where)})`
      );
      res.json({ questions, count: questions.length, filters: where });
    } catch (error) {
      console.error("❌ Database error in getAll:", error);

      // Try to reconnect
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        const questions = await prisma.question.findMany();
        res.json({ questions, count: questions.length });
      } catch (retryError) {
        console.error("❌ Retry failed:", retryError);
        res
          .status(500)
          .json({ error: "Database connection failed", details: error });
      }
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await prisma.question.findUnique({ where: { id } });
      if (!question)
        return res.status(404).json({ error: "Question not found" });
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch question" });
    }
  },
  answer: async (req: Request, res: Response) => {
    // This endpoint can be customized for answer submission logic
    res.json({ message: "answer question" });
  },
  create: async (req: Request, res: Response) => {
    try {
      console.log("Request body:", req.body);
      const { text, options, correct, explanation, categoryId, seriesId } =
        req.body;
      const question = await prisma.question.create({
        data: {
          text,
          options,
          correct,
          explanation,
          categoryId,
          seriesId,
        },
      });
      res.status(201).json(question);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to create question", details: error });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { text, options, correct, explanation, categoryId, seriesId } =
        req.body;
      const question = await prisma.question.update({
        where: { id },
        data: { text, options, correct, explanation, categoryId, seriesId },
      });
      res.json(question);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to update question", details: error });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.question.delete({ where: { id } });
      res.json({ message: "Question deleted" });
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to delete question", details: error });
    }
  },
};

export default QuestionsController;
