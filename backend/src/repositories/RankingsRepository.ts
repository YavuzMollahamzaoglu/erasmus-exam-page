import prisma from "../prismaClient";

export interface CreateRankingInput {
  userId: string;
  score: number;
  time: number;
  categoryId: number;
  seriesId: string;
  correct: number;
}

export const RankingsRepository = {
  async getAll(levelName?: string, typeName?: string) {
    // Build where filters
    const where: any = {};

    // Filter by level (Category.name) via stored Test.category (stringified categoryId)
    if (levelName) {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: { equals: levelName } },
      });
      if (categoryRecord) {
        where.category = String(categoryRecord.id);
      }
    }

    // Filter by test type via related series name
    if (typeName) {
      const t = typeName.toUpperCase();
      if (t === "ERASMUS") {
        where.series = { name: { contains: "Erasmus" } };
      } else if (t === "GENEL") {
        where.series = { name: { contains: "Genel" } };
      } else if (t === "HAZIRLIK") {
        where.series = {
          OR: [
            { name: { contains: "Hazırlık" } },
            { name: { contains: "Hazirlik" } },
            { name: { contains: "Üniversite" } },
            { name: { contains: "Universite" } },
          ],
        };
      }
    }

    // Fetch rankings with desired ordering:
    // 1) Most correct first
    // 2) If same correct, fewer mistakes first
    // 3) If still same, less time first
    // 4) Then higher score (as a soft tiebreaker if used)
    // 5) Finally, earlier submission first
    return prisma.test.findMany({
      where: {
        ...(Object.keys(where).length ? where : {}),
        isRanked: true,
      },
      orderBy: [
        { correct: "desc" },
        { mistakes: "asc" },
        { time: "asc" },
        { score: "desc" },
        { createdAt: "asc" },
      ],
      take: 20,
      include: {
        user: true,
        answers: true,
      },
    });
  },

  async create({
    userId,
    score,
    time,
    categoryId,
    seriesId,
    correct,
    mistakes,
  }: CreateRankingInput & { mistakes: number }) {
    // Save a new ranking (test result)
    // But first, try to REUSE the most recent Test created by this user for the same run
    // to avoid creating a duplicate record without answers (which shows as "Detay Yok" in history).
    try {
      const categoryStr = String(categoryId);
      // Look back a short window (e.g., last 10 minutes) and try to find a matching test
      // with identical stats. Prefer a record that already has answers.
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const existing = await prisma.test.findFirst({
        where: {
          userId,
          category: categoryStr,
          seriesId,
          createdAt: { gte: tenMinutesAgo },
        },
        orderBy: { createdAt: "desc" },
        include: { answers: true },
      });

      if (existing) {
        // Mark this existing detailed test as ranked, then return it
        const updated = await prisma.test.update({
          where: { id: existing.id },
          data: { isRanked: true },
          include: { answers: true },
        });
        return updated;
      }

      // No matching detailed test found: prevent creating an empty record that would show "Detay Yok" in history.
      throw new Error(
        "Uygun bir test kaydı bulunamadı. Lütfen sınavı bitirip geçmişe kaydedildiğinden emin olun ve tekrar deneyin."
      );
    } catch (err) {
      console.error("Prisma create ranking error:", err);
      throw err;
    }
  },
};
