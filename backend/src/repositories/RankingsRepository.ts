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
      where: Object.keys(where).length ? where : undefined,
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
    try {
      return await prisma.test.create({
        data: {
          score,
          userId,
          time,
          correct,
          mistakes,
          category: String(categoryId),
          seriesId,
        },
      });
    } catch (err) {
      console.error("Prisma create ranking error:", err);
      throw err;
    }
  },
};
