
import { Request, Response } from 'express';
import prisma from '../prismaClient';

const CategoriesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },
  getQuestionsByCategory: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const questions = await prisma.question.findMany({
        where: { categoryId: Number(id) },
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions for category', details: error });
    }
  },
  getQuestionsByCategoryAndSeries: async (req: Request, res: Response) => {
    const { categoryId, seriesId } = req.query;
    if (!categoryId || !seriesId) {
      return res.status(400).json({ error: 'categoryId and seriesId are required' });
    }
    try {
      const questions = await prisma.question.findMany({
        where: {
          categoryId: Number(categoryId),
          seriesId: String(seriesId)
        },
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch questions for category and series', details: error });
    }
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    try {
      const newCategory = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create category', details: error });
    }
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const updated = await prisma.category.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.json(updated);
    } catch (error) {
      res.status(404).json({ error: 'Category not found', details: error });
    }
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.category.delete({ where: { id: Number(id) } });
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: 'Category not found', details: error });
    }
  },

};

export default CategoriesController;
