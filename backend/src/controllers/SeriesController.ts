import { Request, Response } from 'express';

import prisma from '../prismaClient';

const SeriesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany();
      res.json(series);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  getNext: async (req: Request, res: Response) => {
    res.json({ message: 'get next question in series' });
  },
  answer: async (req: Request, res: Response) => {
    res.json({ message: 'answer series question' });
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    try {
      const newSeries = await prisma.questionSeries.create({ data: { name } });
      res.status(201).json(newSeries);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  update: async (req: Request, res: Response) => {
    res.json({ message: 'update series' });
  },
  delete: async (req: Request, res: Response) => {
    res.json({ message: 'delete series' });
  },
};

export default SeriesController;
