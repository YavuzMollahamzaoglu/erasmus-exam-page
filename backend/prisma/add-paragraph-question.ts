import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // New sample Fill-in-the-Blanks question (4 blanks, 1 distractor)
  const title = 'Daily Routine';
  const text = 'Every morning, I ______ up at 6 a.m. After breakfast, I ______ to work by bus. At the office, I usually ______ emails and attend meetings. In the evening, I ______ dinner and relax with my family.';
  const options = ['wake', 'go', 'answer', 'cook', 'sleep'];
  const correctAnswers = ['wake', 'go', 'answer', 'cook'];

  const created = await prisma.paragraphQuestion.create({
    data: {
      title,
      text,
      options: JSON.stringify(options),
      correctAnswers: JSON.stringify(correctAnswers),
      level: 'A2',
    },
  });

  console.log('✅ Added ParagraphQuestion:', created.id, '-', created.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
