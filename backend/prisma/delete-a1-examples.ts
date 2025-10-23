import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const a1Words = await prisma.word.findMany({ where: { level: "A1" } });
  let deleted = 0;
  for (const word of a1Words) {
    const deletedExamples = await prisma.wordExample.deleteMany({ where: { wordId: word.id } });
    deleted += deletedExamples.count;
  }
  console.log(`A1 seviyesindeki kelimeler için toplam ${deleted} örnek cümle silindi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());