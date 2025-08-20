import prisma from '../prismaClient';

export interface CreateRankingInput {
userId: string;
score: number;
time: number;
categoryId: number;
seriesId: string;
correct: number;
}

export const RankingsRepository = {
  async getAll() {
    // Fetch top rankings (latest tests with score, time, correct)
    return prisma.test.findMany({
      orderBy: { score: 'desc' },
      take: 20,
      include: {
        user: true,
        answers: true,
      },
    });
  },

  async create({ userId, score, time, categoryId, seriesId, correct, mistakes }: CreateRankingInput & { mistakes: number }) {
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
      console.error('Prisma create ranking error:', err);
      throw err;
    }
  },
};
