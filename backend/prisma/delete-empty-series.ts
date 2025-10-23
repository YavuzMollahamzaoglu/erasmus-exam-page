import prisma from "../src/prismaClient";

async function main() {
  const dryRun = !!process.env.DRY_RUN;

  const series = await prisma.questionSeries.findMany({
    include: { _count: { select: { questions: true, tests: true } } },
    orderBy: { name: 'asc' }
  });

  const empty = series.filter(s => (s as any)._count?.questions === 0);

  console.log(`Found ${series.length} series; ${empty.length} are empty (0 questions).`);
  if (empty.length === 0) {
    console.log('No empty series to remove.');
    return;
  }

  for (const s of empty) {
    console.log(` - ${s.id} | ${s.name} | questions=${(s as any)._count?.questions} | tests=${(s as any)._count?.tests}`);
  }

  if (dryRun) {
    console.log('DRY_RUN set — nothing will be deleted.');
    return;
  }

  const ids = empty.map(s => s.id);
  const res = await prisma.questionSeries.deleteMany({ where: { id: { in: ids } } });
  console.log(`Deleted ${res.count} empty series.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
