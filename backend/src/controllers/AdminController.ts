import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AdminController = {
  dashboard: async (req: Request, res: Response) => {
    res.json({ message: 'admin dashboard stats' });
  },
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id } });
      res.json({ message: 'User deleted', id });
    } catch (err) {
      res.status(404).json({ error: 'User not found or already deleted' });
    }
  },
};

export default AdminController;
