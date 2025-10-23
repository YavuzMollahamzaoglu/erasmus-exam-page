import prisma from "../src/prismaClient";

function norm(s: string) {
  return s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitLevel(name: string) {
  const m = name.match(/^(A1|A2|B1|B2)\s+(.*)$/i);
  if (m) return { level: m[1].toUpperCase(), display: m[2] };
  return { level: "UNKNOWN", display: name };
}

async function main() {
  const dryRun = !!process.env.DRY_RUN;
  const series = await prisma.questionSeries.findMany({
    include: {
      questions: { select: { id: true } },
      tests: { select: { id: true } },
    },
  });

  // Group by (level, normalized display)
  const groups = new Map<string, typeof series>();
  const hiddenIds: string[] = [];

  for (const s of series) {
    const { level, display } = splitLevel(s.name);
    const normalizedDisplay = norm(display);
    // Hide/remove 'Genel İngilizce 1'
    if (normalizedDisplay === "genel ingilizce 1") {
      hiddenIds.push(s.id);
      continue;
    }
    const key = `${level}:${normalizedDisplay}`;
    if (!groups.has(key)) (groups as any).set(key, []);
    (groups.get(key) as any).push(s);
  }

  type Plan = {
    keepId: string;
    remove: string[];
    reassignTo?: string; // alias of keepId
  };

  const plans: Plan[] = [];

  for (const [key, arr] of groups.entries()) {
    if (arr.length <= 1) continue;
    // Choose the one with most questions as keeper
    const sorted = [...arr].sort(
      (a, b) => b.questions.length - a.questions.length
    );
    const keep = sorted[0];
    const remove = sorted.slice(1).map((s) => s.id);
    plans.push({ keepId: keep.id, remove, reassignTo: keep.id });
  }

  const totalToRemove =
    hiddenIds.length + plans.reduce((n, p) => n + p.remove.length, 0);

  console.log("Cleanup plan:");
  console.log(
    ` - Hidden series to delete (Genel İngilizce 1): ${hiddenIds.length}`
  );
  console.log(` - Duplicate groups to resolve: ${plans.length}`);
  console.log(` - Total series to delete: ${totalToRemove}`);

  if (dryRun) {
    console.log("DRY_RUN is set. No changes will be applied.");
    return;
  }

  // Execute reassignments then deletes
  for (const p of plans) {
    for (const fromId of p.remove) {
      await prisma.question.updateMany({
        where: { seriesId: fromId },
        data: { seriesId: p.keepId },
      });
      await prisma.test.updateMany({
        where: { seriesId: fromId },
        data: { seriesId: p.keepId },
      });
    }
  }

  if (plans.length) {
    const ids = plans.flatMap((p) => p.remove);
    if (ids.length) {
      await prisma.questionSeries.deleteMany({ where: { id: { in: ids } } });
      console.log(`Deleted ${ids.length} duplicate series.`);
    }
  }

  if (hiddenIds.length) {
    // For hidden series, we simply delete the series; questions will have seriesId set to NULL (ON DELETE SET NULL)
    await prisma.questionSeries.deleteMany({
      where: { id: { in: hiddenIds } },
    });
    console.log(
      `Deleted ${hiddenIds.length} hidden series (Genel İngilizce 1).`
    );
  }

  console.log("Cleanup complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
