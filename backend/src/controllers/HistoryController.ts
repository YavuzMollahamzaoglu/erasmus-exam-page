import { Request, Response } from 'express';


import prisma from '../prismaClient';

const HistoryController = {
  getAll: async (req: Request, res: Response) => {
    console.log('HISTORY GETALL ÇALIŞTI');
    try {
      // Optionally, get userId from auth middleware (req.user.id), fallback to all users for demo
      const userId = req.user?.id;
      const category = req.query.category as string | undefined;
      let where: any = {};
      if (userId) where.userId = userId;
      if (category && category !== 'all') where.category = category;

      const tests = await prisma.test.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          answers: {
            include: { question: true },
          },
          series: true,
        },
      });

      // Format for frontend
      const history = tests.map(test => ({
        id: test.id,
        title: test.series?.name || 'Test',
        category: test.category,
        date: test.createdAt,
        duration: test.time + ' sn',
        correct: test.correct,
        incorrect: test.mistakes,
        questions: test.answers.map(ans => ({
          text: ans.question.text,
          userAnswer: ans.selected,
          isCorrect: ans.correct,
          correctAnswer: ans.question.correct,
        })),
      }));

      res.json({ history });
    } catch (err) {
      res.status(500).json({ error: 'History fetch error', details: err });
    }
  },
  getById: async (req: Request, res: Response) => {
    res.json({ message: 'get history by id' });
  },
  save: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const { category, duration, correct, incorrect, questions } = req.body;
      // Save test to DB
      const test = await prisma.test.create({
        data: {
          userId,
          category,
          time: duration,
          correct,
          mistakes: incorrect,
          score: correct, // Use correct as score, adjust if needed
          answers: {
            create: (questions || []).map((q: any) => ({
              question: { connect: { id: q.questionId } },
              selected: q.userAnswer,
              correct: q.isCorrect,
            }))
          },
        },
        include: { answers: true }
      });
      res.status(201).json({ message: 'History saved', test });
    } catch (err) {
      res.status(500).json({ error: 'History save error', details: err });
    }
  },
};

export default HistoryController;
