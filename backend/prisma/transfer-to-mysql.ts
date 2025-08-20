import { PrismaClient } from "@prisma/client";

const prismaOld = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db", // SQLite
    },
  },
});

const prismaNew = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // MySQL
    },
  },
});

async function transferData() {
  console.log("🔄 Starting data transfer from SQLite to MySQL...");

  try {
    // 1. Transfer Categories
    const categories = await prismaOld.category.findMany();
    for (const category of categories) {
      await prismaNew.category.create({
        data: {
          id: category.id,
          name: category.name,
        },
      });
    }
    console.log(`✅ Transferred ${categories.length} categories`);

    // 2. Transfer QuestionSeries
    const series = await prismaOld.questionSeries.findMany();
    for (const s of series) {
      await prismaNew.questionSeries.create({
        data: {
          id: s.id,
          name: s.name,
        },
      });
    }
    console.log(`✅ Transferred ${series.length} question series`);

    // 3. Transfer Questions
    const questions = await prismaOld.question.findMany();
    for (const q of questions) {
      await prismaNew.question.create({
        data: {
          id: q.id,
          text: q.text,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
          categoryId: q.categoryId,
          seriesId: q.seriesId,
        },
      });
    }
    console.log(`✅ Transferred ${questions.length} questions`);

    // 4. Transfer Users (if any)
    const users = await prismaOld.user.findMany();
    for (const user of users) {
      await prismaNew.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          name: user.name,
          token: user.token,
          role: user.role,
          profilePhoto: user.profilePhoto,
          passwordResetToken: user.passwordResetToken,
          passwordResetExpires: user.passwordResetExpires,
          createdAt: user.createdAt,
        },
      });
    }
    console.log(`✅ Transferred ${users.length} users`);

    console.log("🎉 Data transfer completed successfully!");
  } catch (error) {
    console.error("❌ Error during transfer:", error);
  } finally {
    await prismaOld.$disconnect();
    await prismaNew.$disconnect();
  }
}

transferData();
