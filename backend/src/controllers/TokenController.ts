import { Request, Response } from 'express';

const TokenController = {
  getToken: async (req: Request, res: Response) => {
    res.json({ message: 'get token info' });
  },
  refreshToken: async (req: Request, res: Response) => {
    res.json({ message: 'refresh token' });
  },
};

export default TokenController;
