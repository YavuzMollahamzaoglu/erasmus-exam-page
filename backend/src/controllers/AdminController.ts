import { Request, Response } from "express";
import prisma from "../prismaClient";

const AdminController = {
  dashboard: async (req: Request, res: Response) => {
    res.json({ message: "admin dashboard stats" });
  },
  listPreviews: async (_req: Request, res: Response) => {
    try {
      const rows = await (prisma as any).examPreview.findMany({
        orderBy: { updatedAt: "desc" },
        take: 200,
      });
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: "Failed to list previews" });
    }
  },
  recomputePreviews: async (req: Request, res: Response) => {
    try {
      const { category, limit } = req.query as any;
      const take = Math.min(Math.max(parseInt(limit as string) || 60, 10), 100);

      const categories = category
        ? await prisma.category.findMany({
            where: { name: { contains: String(category) } },
            orderBy: { id: "asc" },
          })
        : await prisma.category.findMany({ orderBy: { id: "asc" } });
      const allSeries = await prisma.questionSeries.findMany({
        orderBy: { name: "asc" },
      });

      const gains = {
        summary:
          "Bu test; okuma, dilbilgisi ve kelime bilgisini birlikte ölçer. Bu önizleme otomatik çıkarımlara dayanmaktadır.",
        bullets: [
          "Sık görülen dilbilgisi kalıplarını pekiştirme",
          "Bağlamdan anlam çıkarma",
          "Seçenekler arasında fonksiyon ayrımı",
        ],
        tips: [
          "Önce soru kökünü oku",
          "Seçenekleri eleme yöntemiyle daralt",
          "Süreyi yönet",
        ],
      };

      const gRules: Array<{ key: string; re: RegExp }> = [
        {
          key: "Tenses",
          re: /(past|present|future|simple|continuous|perfect)\b/i,
        },
        { key: "Conditionals", re: /conditional|if-clause|if\s+(i|ii|iii)/i },
        { key: "Prepositions", re: /\b(preposition|in|on|at|into|onto)\b/i },
        { key: "Articles", re: /\b(article|a|an|the)\b/i },
        {
          key: "Modal Verbs",
          re: /\b(can|could|may|might|must|should|would|modal)\b/i,
        },
        { key: "Passive Voice", re: /passive|be\s+\w+ed/i },
        {
          key: "Comparatives/Superlatives",
          re: /comparative|superlative|\bthan\b|\w+est\b|\w+er\b/i,
        },
        {
          key: "Gerund/Infinitive",
          re: /gerund|infinitive|to\s+\w+|\w+ing\b/i,
        },
        { key: "Relative Clauses", re: /relative|\bwhich\b|\bwho\b|\bthat\b/i },
      ];

      let updated = 0;
      for (const s of allSeries) {
        const qs = await prisma.question.findMany({
          where: { seriesId: s.id },
          take,
          orderBy: { id: "asc" },
        });
        if (!qs.length) continue;
        const totalQ = qs.length;
        const buckets: Record<string, number> = {};
        const gb: Record<string, number> = {};
        const inc = (k: string) => (buckets[k] = (buckets[k] || 0) + 1);
        const ginc = (k: string) => (gb[k] = (gb[k] || 0) + 1);
        for (const q of qs) {
          const text = (q.text || "").toString();
          const lower = text.toLowerCase();
          let opts: string[] = [];
          try {
            opts = JSON.parse(q.options);
          } catch {}
          const avgOptLen = opts.length
            ? opts.join(" ").length / opts.length
            : 0;
          if (
            /tense|past|present|future|conditional|preposition|article|choose the correct|grammar|verb|adjective|adverb/i.test(
              lower
            )
          ) {
            inc("Grammar");
            for (const r of gRules) {
              if (r.re.test(text)) {
                ginc(r.key);
                break;
              }
            }
            continue;
          }
          if (
            text.length > 140 ||
            /paragraph|passage|according to|author|main idea/i.test(lower)
          ) {
            inc("Reading");
            continue;
          }
          if (avgOptLen < 8) {
            inc("Vocabulary");
            continue;
          }
          inc("General");
          for (const r of gRules) {
            if (r.re.test(text)) {
              ginc(r.key);
              break;
            }
          }
        }
        const topics = Object.entries(buckets)
          .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalQ) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
        const grammar = Object.entries(gb)
          .map(([name, count]) => ({
            name,
            count: count as number,
            percentage: Math.round(((count as number) / totalQ) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
        // Simple difficulty proxy
        const avgLen =
          qs.reduce((s, q) => s + (q.text?.length || 0), 0) / totalQ;
        let overall: "çok kolay" | "kolay" | "orta" | "zor" | "çok zor" =
          "orta";
        if (avgLen < 60) overall = "kolay";
        else if (avgLen > 180) overall = "zor";
        const difficulty = {
          overall,
          distribution: [
            {
              level: "çok kolay",
              count: Math.max(0, Math.round(totalQ * 0.05)),
              percentage: 5,
            },
            {
              level: "kolay",
              count: Math.max(
                0,
                Math.round(totalQ * (overall === "kolay" ? 0.45 : 0.25))
              ),
              percentage: overall === "kolay" ? 45 : 25,
            },
            {
              level: "orta",
              count: Math.max(0, Math.round(totalQ * 0.4)),
              percentage: 40,
            },
            {
              level: "zor",
              count: Math.max(
                0,
                Math.round(totalQ * (overall === "zor" ? 0.25 : 0.15))
              ),
              percentage: overall === "zor" ? 25 : 15,
            },
            {
              level: "çok zor",
              count: Math.max(0, Math.round(totalQ * 0.05)),
              percentage: 5,
            },
          ],
        };

        await (prisma as any).examPreview.upsert({
          where: {
            categoryId_seriesId: { categoryId: null, seriesId: s.id } as any,
          },
          update: {
            total: totalQ,
            topics: topics as any,
            grammar: grammar as any,
            difficulty: difficulty as any,
            gains: gains as any,
            source: "heuristic",
          },
          create: {
            categoryId: null as any,
            seriesId: s.id,
            total: totalQ,
            topics: topics as any,
            grammar: grammar as any,
            difficulty: difficulty as any,
            gains: gains as any,
            source: "heuristic",
          },
        });
        updated++;
      }

      res.json({ updated });
    } catch (e: any) {
      res
        .status(500)
        .json({ error: "Failed to recompute previews", details: e?.message });
    }
  },
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id } });
      res.json({ message: "User deleted", id });
    } catch (err) {
      res.status(404).json({ error: "User not found or already deleted" });
    }
  },
};

export default AdminController;
