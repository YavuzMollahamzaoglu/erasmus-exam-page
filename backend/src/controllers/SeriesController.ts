import { Request, Response } from "express";

import prisma from "../prismaClient";

const SeriesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const series = await prisma.questionSeries.findMany();
      res.json(series);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
  getNext: async (req: Request, res: Response) => {
    res.json({ message: "get next question in series" });
  },
  answer: async (req: Request, res: Response) => {
    res.json({ message: "answer series question" });
  },
  create: async (req: Request, res: Response) => {
    let { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    name = String(name).trim();
    const { questions } = req.body;
    // Prevent creating empty series
    if (Array.isArray(questions) && questions.length === 0) {
      return res.status(400).json({
        error: "Cannot create empty QuestionSeries (no questions provided)",
      });
    }
    try {
      // Safety gate: if automatic creates are globally disabled, only allow when correct admin header is present
      const disableAuto = String(
        process.env.DISABLE_AUTO_SERIES_CREATE || ""
      ).toLowerCase();
      if (disableAuto === "1" || disableAuto === "true") {
        const tokenHeader = req.header("X-ADMIN-CREATE-TOKEN") || "";
        const expected = process.env.ADMIN_CREATE_TOKEN || "";
        if (!tokenHeader || tokenHeader !== expected) {
          return res
            .status(403)
            .json({ error: "Automatic series creation is disabled" });
        }
      }
      // Try to find an existing series by case-insensitive match on name
      const existing = await prisma.questionSeries.findFirst({
        where: { name: { equals: name, mode: "insensitive" } as any },
      });
      if (existing) {
        // Return existing resource to make endpoint idempotent
        return res.status(200).json(existing);
      }
      const newSeries = await prisma.questionSeries.create({ data: { name } });
      res.status(201).json(newSeries);
    } catch (err) {
      console.error("Series create error:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
  update: async (req: Request, res: Response) => {
    res.json({ message: "update series" });
  },
  delete: async (req: Request, res: Response) => {
    res.json({ message: "delete series" });
  },
};

export default SeriesController;
