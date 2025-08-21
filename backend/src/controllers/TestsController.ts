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

  // Get A1 Erasmus questions
  getA1ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany({ where: { name: { contains: 'Erasmus' } }, select: { id: true } });
      const seriesIds = series.map(s => s.id);

      const questions = await prisma.question.findMany({
        where: {
          category: { name: 'A1' },
          seriesId: { in: seriesIds.length ? seriesIds : undefined },
        },
        include: { answers: true },
      });

      res.json({ questions });
    } catch (error) {
      console.error('Error fetching A1 Erasmus questions:', error);
      res.status(500).json({ error: 'Sorular alınırken hata oluştu' });
    }
  },

  // Get A2 Erasmus questions
  getA2ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany({ where: { name: { contains: 'Erasmus' } }, select: { id: true } });
      const seriesIds = series.map(s => s.id);

      const questions = await prisma.question.findMany({
        where: {
          category: { name: 'A2' },
          seriesId: { in: seriesIds.length ? seriesIds : undefined },
        },
        include: { answers: true },
      });

      res.json({ questions });
    } catch (error) {
      console.error('Error fetching A2 Erasmus questions:', error);
      res.status(500).json({ error: 'Sorular alınırken hata oluştu' });
    }
  },

  // Get B1 Erasmus questions
  getB1ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany({ where: { name: { contains: 'Erasmus' } }, select: { id: true } });
      const seriesIds = series.map(s => s.id);

      const questions = await prisma.question.findMany({
        where: {
          category: { name: 'B1' },
          seriesId: { in: seriesIds.length ? seriesIds : undefined },
        },
        include: { answers: true },
      });

      res.json({ questions });
    } catch (error) {
      console.error('Error fetching B1 Erasmus questions:', error);
      res.status(500).json({ error: 'Sorular alınırken hata oluştu' });
    }
  },

  // Get B2 Erasmus questions
  getB2ErasmusQuestions: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany({ where: { name: { contains: 'Erasmus' } }, select: { id: true } });
      const seriesIds = series.map(s => s.id);

      const questions = await prisma.question.findMany({
        where: {
          category: { name: 'B2' },
          seriesId: { in: seriesIds.length ? seriesIds : undefined },
        },
        include: { answers: true },
      });

      res.json({ questions });
    } catch (error) {
      console.error('Error fetching B2 Erasmus questions:', error);
      res.status(500).json({ error: 'Sorular alınırken hata oluştu' });
    }
  },
};

export default TestsController;
