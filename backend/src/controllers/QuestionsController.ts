import { Request, Response } from 'express';
import prisma from '../prismaClient';

const QuestionsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const questions = await prisma.question.findMany();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await prisma.question.findUnique({ where: { id } });
      if (!question) return res.status(404).json({ error: 'Question not found' });
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch question' });
    }
  },
  answer: async (req: Request, res: Response) => {
    // This endpoint can be customized for answer submission logic
    res.json({ message: 'answer question' });
  },
  create: async (req: Request, res: Response) => {
    try {
      console.log('Request body:', req.body);
      const { text, options, correct, explanation, categoryId, seriesId } = req.body;
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
      res.status(400).json({ error: 'Failed to create question', details: error });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { text, options, correct, explanation, categoryId, seriesId } = req.body;
      const question = await prisma.question.update({
        where: { id },
        data: { text, options, correct, explanation, categoryId, seriesId },
      });
      res.json(question);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update question', details: error });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.question.delete({ where: { id } });
      res.json({ message: 'Question deleted' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete question', details: error });
    }
  },
};

export default QuestionsController;
