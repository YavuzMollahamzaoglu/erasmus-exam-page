import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TestsController = {
  getTest: async (req: Request, res: Response) => {
    res.json({ message: "get test by id" });
  },
  submit: async (req: Request, res: Response) => {
    res.json({ message: "submit test answers" });
  },
  result: async (req: Request, res: Response) => {
    res.json({ message: "get test result" });
  },

  // Generic: get questions by QuestionSeries ID
  getQuestionsBySeries: async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // seriesId
      if (!id) return res.status(400).json({ error: "series id is required" });

      const series = await prisma.questionSeries.findUnique({ where: { id } });
      if (!series) return res.status(404).json({ error: "Series not found" });

      const questions = await prisma.question.findMany({
        where: { seriesId: id },
        include: { category: true, series: true },
        orderBy: { id: "asc" },
      });

      return res.json({ questions, count: questions.length, series });
    } catch (error) {
      console.error("Error fetching questions by series:", error);
      res
        .status(500)
        .json({
          error: "Failed to fetch questions for series",
          details: (error as any)?.message,
        });
    }
  },

  // Get A1 Erasmus questions
  getA1ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await prisma.question.findMany({
        where: {
          category: {
            name: "A1",
          },
          series: {
            name: "Erasmus",
          },
        },
        include: {
          answers: true,
        },
      });

      res.json({ questions });
    } catch (error) {
      console.error("Error fetching A1 Erasmus questions:", error);
      res.status(500).json({ error: "Sorular alınırken hata oluştu" });
    }
  },

  // Get A2 Erasmus questions
  getA2ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await prisma.question.findMany({
        where: {
          category: {
            name: "A2",
          },
          series: {
            name: "Erasmus",
          },
        },
        include: {
          answers: true,
        },
      });

      res.json({ questions });
    } catch (error) {
      console.error("Error fetching A2 Erasmus questions:", error);
      res.status(500).json({ error: "Sorular alınırken hata oluştu" });
    }
  },

  // Get B1 Erasmus questions
  getB1ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await prisma.question.findMany({
        where: {
          category: {
            name: "B1",
          },
          series: {
            name: "Erasmus",
          },
        },
        include: {
          answers: true,
        },
      });

      res.json({ questions });
    } catch (error) {
      console.error("Error fetching B1 Erasmus questions:", error);
      res.status(500).json({ error: "Sorular alınırken hata oluştu" });
    }
  },

  // Get B2 Erasmus questions
  getB2ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await prisma.question.findMany({
        where: {
          category: {
            name: "B2",
          },
          series: {
            name: "Erasmus",
          },
        },
        include: {
          answers: true,
        },
      });

      res.json({ questions });
    } catch (error) {
      console.error("Error fetching B2 Erasmus questions:", error);
      res.status(500).json({ error: "Sorular alınırken hata oluştu" });
    }
  },
};

export default TestsController;
