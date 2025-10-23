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

      // Merge duplicates from the same run (e.g., a separate ranking-only row)
      // Use a composite key to group close-in-time entries with identical stats.
      const groups = new Map<string, typeof tests>();
      for (const t of tests) {
        const key = [
          t.userId || "",
          t.seriesId || "",
          t.category || "",
          t.correct,
          t.mistakes,
          t.time,
        ].join("|");
        const existing = groups.get(key) as any[] | undefined;
        if (!existing) groups.set(key, [t] as any);
        else existing.push(t);
      }

      // Pick best representative per group: prefer one with answers
      const merged: typeof tests = [] as any;
      for (const arr of groups.values() as any) {
        const withAns = arr.find((x: any) => x.answers && x.answers.length > 0);
        merged.push(withAns || arr[0]);
      }

      // Lookup difficulty previews in bulk by seriesId
      const uniqueSeriesIds = Array.from(
        new Set(
          merged
            .map((t: any) => t.seriesId)
            .filter((id: any) => typeof id === "string" && id.length > 0)
        )
      );
      let previewsBySeries: Record<string, any> = {};
      if (uniqueSeriesIds.length) {
        try {
          const previews = await (prisma as any).examPreview.findMany({
            where: { seriesId: { in: uniqueSeriesIds } },
            select: { seriesId: true, difficulty: true },
          });
          previewsBySeries = Object.fromEntries(
            previews.map((p: any) => [p.seriesId, p])
          );
        } catch (e) {
          // ignore preview join errors; continue without difficulty
          previewsBySeries = {};
        }
      }

      // Back to simple title: series name or 'Test'
      const history = merged.map((test) => {
        const seriesId = (test as any).seriesId || undefined;
        const prev = seriesId ? previewsBySeries[seriesId] : undefined;
        let difficultyOverall: string | null = null;
        if (prev && prev.difficulty && prev.difficulty.overall) {
          difficultyOverall = String(prev.difficulty.overall);
        } else {
          // Heuristic fallback using avg question text length
          try {
            const texts = (test.answers || []).map(
              (a: any) => a?.question?.text || ""
            );
            const totalLen = texts.reduce(
              (s: number, t: string) => s + (t?.length || 0),
              0
            );
            const avg = texts.length ? totalLen / texts.length : 0;
            if (avg <= 60) difficultyOverall = "kolay";
            else if (avg >= 180) difficultyOverall = "zor";
            else difficultyOverall = "orta";
          } catch {
            difficultyOverall = null;
          }
        }
        return {
          id: test.id,
          title: test.series?.name || "Test",
          category: test.category,
          date: test.createdAt,
          duration: test.time + " sn",
          correct: test.correct,
          incorrect: test.mistakes,
          seriesId,
          difficultyOverall,
          questions: test.answers.map((ans) => ({
            text: ans.question.text,
            userAnswer: ans.selected,
            isCorrect: ans.correct,
            correctAnswer: ans.question.correct,
            explanation: ans.question.explanation,
          })),
        };
      });

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
          isRanked: false,
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
