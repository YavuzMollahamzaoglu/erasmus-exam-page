import { Request, Response } from "express";

import prisma from "../prismaClient";

const HistoryController = {
  getAll: async (req: Request, res: Response) => {
    console.log("HISTORY GETALL ÇALIŞTI");
    try {
      // Get userId from auth middleware payload
      const userId = (req.user as any)?.userId || (req.user as any)?.id;
      const category = req.query.category as string | undefined;
      let where: any = {};
      if (userId) where.userId = userId;
      if (category && category !== "all") where.category = category;

      const tests = await prisma.test.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          answers: {
            include: { question: true },
          },
          series: true,
        },
      });

      // Back to simple title: series name or 'Test'
      const history = tests.map((test) => ({
        id: test.id,
        title: test.series?.name || "Test",
        category: test.category,
        date: test.createdAt,
        duration: test.time + " sn",
        correct: test.correct,
        incorrect: test.mistakes,
        questions: test.answers.map((ans) => ({
          text: ans.question.text,
          userAnswer: ans.selected,
          isCorrect: ans.correct,
          correctAnswer: ans.question.correct,
          explanation: ans.question.explanation,
        })),
      }));

      res.json({ history });
    } catch (err) {
      res.status(500).json({ error: "History fetch error", details: err });
    }
  },
  getById: async (_req: Request, res: Response) => {
    res.json({ message: "get history by id" });
  },
  save: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.userId || (req.user as any)?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const { category, duration, correct, incorrect, questions, seriesId } =
        req.body;

      const safeCategory =
        typeof category === "string" ? category : String(category);
      const createAnswers = (Array.isArray(questions) ? questions : [])
        .filter((q: any) => q && q.questionId)
        .map((q: any) => ({
          question: { connect: { id: String(q.questionId) } },
          selected:
            typeof q.userAnswer === "string"
              ? q.userAnswer
              : q.userAnswer == null
              ? ""
              : String(q.userAnswer),
          correct: !!q.isCorrect,
        }));

      const test = await prisma.test.create({
        data: {
          userId,
          category: safeCategory,
          time: Number(duration) || 0,
          correct: Number(correct) || 0,
          mistakes: Number(incorrect) || 0,
          score: Number(correct) || 0,
          seriesId: seriesId || undefined,
          ...(createAnswers.length > 0
            ? { answers: { create: createAnswers } }
            : {}),
        },
        include: { answers: true },
      });
      res.status(201).json({ message: "History saved", test });
    } catch (err) {
      res
        .status(500)
        .json({ error: "History save error", details: String(err) });
    }
  },
};

export default HistoryController;
