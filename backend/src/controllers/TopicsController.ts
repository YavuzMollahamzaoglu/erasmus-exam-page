import { Request, Response } from "express";
import prisma from "../prismaClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

type TopicItem = { name: string; count: number; percentage?: number };
type GrammarItem = { name: string; count: number; percentage?: number };
type DifficultyItem = {
  level: "çok kolay" | "kolay" | "orta" | "zor" | "çok zor";
  count: number;
  percentage?: number;
};
type Gains = { summary?: string; bullets?: string[]; tips?: string[] };

// simple in-memory cache with TTL
const cache = new Map<string, { data: any; expires: number }>();
const TTL_MS = 1000 * 60 * 60; // 1 hour

const getFromCache = (key: string) => {
  const v = cache.get(key);
  if (!v) return null;
  if (Date.now() > v.expires) {
    cache.delete(key);
    return null;
  }
  return v.data;
};

const setCache = (key: string, data: any) => {
  cache.set(key, { data, expires: Date.now() + TTL_MS });
};

const getGemini = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// Heuristic fallback when AI is unavailable
const heuristicTopics = (
  questions: { text: string; options: string | string[] }[]
) => {
  const buckets: Record<string, number> = {};
  const inc = (k: string) => (buckets[k] = (buckets[k] || 0) + 1);

  // grammar buckets
  const gBuckets: Record<string, number> = {};
  const ginc = (k: string) => (gBuckets[k] = (gBuckets[k] || 0) + 1);
  const gRules: Array<{ key: string; re: RegExp }> = [
    { key: "Tenses", re: /(past|present|future|simple|continuous|perfect)\b/ },
    { key: "Conditionals", re: /conditional|if-clause|if\s+(i|ii|iii)/ },
    { key: "Prepositions", re: /preposition|in\b|on\b|at\b|into\b|onto\b/ },
    { key: "Articles", re: /article|\ba\b|\ban\b|\bthe\b/ },
    { key: "Modal Verbs", re: /can|could|may|might|must|should|would|modal/ },
    { key: "Passive Voice", re: /passive|be\s+\w+ed/ },
    {
      key: "Comparatives/Superlatives",
      re: /comparative|superlative|than|est\b|er\b/,
    },
    { key: "Gerund/Infinitive", re: /gerund|infinitive|to\s+\w+|\w+ing/ },
    { key: "Relative Clauses", re: /relative|which\b|who\b|that\b/ },
    {
      key: "Question Forms",
      re: /\?|\b(what|which|who|whom|whose|where|when|why|how)\b|^(\s)*(do|does|did|is|are|am|was|were|can|should|would)\b/i,
    },
    {
      key: "Pronouns",
      re: /pronoun|\b(he|she|they|them|him|her|we|us|you|i|me|mine|yours|hers|his|theirs|ours)\b/i,
    },
    {
      key: "Phrasal Verbs",
      re: /\b\w+\s+(up|off|in|out|on|over|through|away|back)\b/,
    },
  ];

  for (const q of questions) {
    const text = q.text.toLowerCase();
    const opts = Array.isArray(q.options)
      ? q.options
      : (() => {
          try {
            return JSON.parse(q.options);
          } catch {
            return [];
          }
        })();
    const avgOptLen = opts.length ? opts.join(" ").length / opts.length : 0;

    if (
      /tense|past|present|future|conditional|preposition|article|choose the correct|grammar|verb|adjective|adverb|pronoun|clause|question|modal|passive/.test(
        text
      )
    ) {
      inc("Grammar");
      // try grammar subtopic
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
      /paragraph|passage|according to|author|main idea/.test(text)
    ) {
      inc("Reading");
      continue;
    }
    if (avgOptLen < 8) {
      inc("Vocabulary");
      continue;
    }
    inc("General");
    // guess by options style
    for (const r of gRules) {
      if (r.re.test(text)) {
        ginc(r.key);
        break;
      }
    }
  }

  const total = questions.length || 1;
  const PRIORITY = [
    "Tenses",
    "Pronouns",
    "Question Forms",
    "Phrasal Verbs",
    "Prepositions",
    "Articles",
    "Modal Verbs",
    "Passive Voice",
    "Comparatives/Superlatives",
    "Gerund/Infinitive",
    "Relative Clauses",
    "Vocabulary",
    "Reading",
    "Grammar",
    "General",
  ];
  const idx = (name: string) => {
    const i = PRIORITY.findIndex((p) => p.toLowerCase() === name.toLowerCase());
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const topics: TopicItem[] = Object.entries(buckets)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => {
      const ai = idx(a.name),
        bi = idx(b.name);
      if (ai !== bi) return ai - bi;
      return b.count - a.count;
    });

  const grammar: GrammarItem[] = Object.entries(gBuckets)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => {
      const ai = idx(a.name),
        bi = idx(b.name);
      if (ai !== bi) return ai - bi;
      return b.count - a.count;
    })
    .slice(0, 8);

  // Build topic-specific guidance
  const topGrammar = [...grammar].slice(0, 3).map((g) => g.name.toLowerCase());
  const tipMap: Record<string, string> = {
    tenses:
      "Zaman zarfları (yesterday, since, will) ve yardımcı fiilleri (do/does/did, have/has/had) kontrol edin.",
    conditionals:
      "If-clause kip uyumuna ve ana cümledeki modal kullanıma dikkat edin (If I were…, would/could).",
    prepositions:
      "Sabit kalıpları hatırlayın (on Monday, at night, in 1990) ve fiil-edat eşleşmelerine bakın.",
    articles:
      "Belirtme ve sayılabilirlik: ilk bahsi “a/an”, bilinen/tekil olan “the” ile ifade edilir.",
    "modal verbs":
      "Modal + fiilin yalın hâli (can go, should study); zorunluluk/olasılık anlamını bağlamdan seçin.",
    "passive voice":
      "be + V3 dizilimini ve özne-nesne dönüşümünü yakalayın (The book was written…).",
    "comparatives/superlatives":
      "-er/-est, more/most ve than ipuçlarına dikkat edin; much/far ile güçlendiriciler de görülür.",
    "gerund/infinitive":
      "To + V1 / V-ing tercihleri fiile göre değişir (enjoy V-ing, want to V).",
    "relative clauses":
      "Who/which/that ile bağlanan yan cümlede referansı belirleyin; relative pronoun seçimine bakın.",
    "question forms":
      "Yardımcı fiil + özne ters çevrimi (Do you…? Is he…?) ve WH kelimesi uyumunu kontrol edin.",
    pronouns:
      "Referans aldığı ismi bulun; kişi/nesne/iyelik uyumunu (he/him/his, they/them/their) doğru seçin.",
    "phrasal verbs":
      "Fiil + edatın birleşik anlamı önemlidir (pick up, give up); cümle bağlamına göre edatı seçin.",
    reading:
      "Ana fikir ve anahtar kelimeleri yakalayın; seçeneklerdeki çeldiricilere karşı metinle karşılaştırın.",
    vocabulary:
      "Eş anlam/karşıt anlam ve bağlam ipuçlarını kullanın; kelime türüne (isim/fiil/sıfat) dikkat edin.",
    grammar: "Cümle yapısı, özne-yüklem uyumu ve zaman tutarlılığına bakın.",
    general:
      "Önce soru kökünü okuyun; bariz yanlışları eleyip kalan seçenekleri bağlama göre karşılaştırın.",
  };
  const dynamicTips: string[] = [];
  for (const key of topGrammar) {
    if (tipMap[key]) dynamicTips.push(tipMap[key]);
  }
  if (dynamicTips.length < 3) {
    // complement with general strategies relevant to detected buckets
    if (buckets["Reading"] && !dynamicTips.find((t) => t.includes("Ana fikir")))
      dynamicTips.push(tipMap["reading"]);
    if (
      buckets["Vocabulary"] &&
      !dynamicTips.find((t) => t.includes("Eş anlam"))
    )
      dynamicTips.push(tipMap["vocabulary"]);
    if (!dynamicTips.length) dynamicTips.push(tipMap["general"]);
  }
  const gains: Gains = {
    summary:
      "Bu testte en çok görülen konu başlıklarına odaklanarak daha hızlı ve doğru seçim yapabilirsiniz.",
    bullets: topics
      .slice(0, 4)
      .map((t) => `${t.name}: ${t.count} soru (${t.percentage}%)`),
    tips: dynamicTips.slice(0, 5),
  };
  return { topics, total, gains, grammar };
};

const TopicsController = {
  preview: async (req: Request, res: Response) => {
    try {
      const { categoryId, seriesId, category, series, limit } =
        req.query as any;
      const key = JSON.stringify({
        categoryId,
        seriesId,
        category,
        series,
        limit: Number(limit) || 60,
      });
      const cached = getFromCache(key);
      if (cached) return res.json({ ...cached, cached: true });

      // Build filters similar to QuestionsController
      const where: any = {};
      if (categoryId) where.categoryId = parseInt(categoryId);
      if (seriesId) where.seriesId = String(seriesId);

      if (category && !where.categoryId) {
        const cat = await prisma.category.findFirst({
          where: { name: { equals: String(category) } },
        });
        if (cat) where.categoryId = cat.id;
      }
      if (series && !where.seriesId) {
        // Resolve seriesId by series name; if category (level) provided, ensure the series name starts with that level (e.g., "B1 ")
        const andConds: any[] = [{ name: { contains: String(series) } }];
        if (category) {
          andConds.push({ name: { startsWith: String(category) + " " } });
        }
        const s = await prisma.questionSeries.findFirst({
          where: { AND: andConds },
        });
        if (s) where.seriesId = s.id;
      }

      const take = Math.min(Math.max(parseInt(limit as string) || 60, 10), 100);
      // If seriesId is specified, analyze the entire series (no limit) so preview is unique to that test
      const questions = await prisma.question.findMany({
        where,
        ...(where.seriesId ? {} : { take }),
        orderBy: { id: "asc" },
      });

      // Try persisted preview (24h TTL) but always honor live question count for total
      // NOTE: Current schema does not include JSON fields (topics, grammar, difficulty, gains),
      // so skip returning persisted rich preview to avoid type mismatches.
      if (where.categoryId || where.seriesId) {
        try {
          const existing = await prisma.examPreview.findUnique({
            where: {
              categoryId_seriesId: {
                categoryId: where.categoryId ?? null,
                seriesId: where.seriesId ?? null,
              } as any,
            },
          });
          const fresh =
            existing &&
            (existing as any).updatedAt &&
            Date.now() - new Date((existing as any).updatedAt).getTime() <
              24 * 60 * 60 * 1000;
          if (existing && fresh) {
            // If stored total is stale, update it to reflect the current series size
            const liveTotal = questions?.length || 0;
            if ((existing as any).total !== liveTotal) {
              await prisma.examPreview.update({
                where: {
                  categoryId_seriesId: {
                    categoryId: (existing as any).categoryId ?? null,
                    seriesId: (existing as any).seriesId ?? null,
                  } as any,
                },
                data: { total: liveTotal },
              });
            }
            // Recompute lightweight heuristic so we can return specific topics/grammar
            const heur = heuristicTopics(
              (questions || []).map((q) => ({
                text: q.text as any,
                options: (q as any).options,
              }))
            );
            return res.json({
              topics: heur.topics || [],
              total: liveTotal,
              grammar: heur.grammar || [],
              difficulty: undefined,
              gains: heur.gains || undefined,
              persisted: true,
            });
          }
        } catch {}
      }

      if (!questions.length) {
        const empty = { topics: [], total: 0 };
        setCache(key, empty);
        return res.json(empty);
      }

      const gemini = getGemini();
      let resultPayload: {
        topics: TopicItem[];
        total: number;
        gains?: Gains;
        grammar?: GrammarItem[];
        difficulty?: {
          distribution: DifficultyItem[];
          overall?: DifficultyItem["level"];
        };
      } | null = null;

      if (!gemini) {
        // Fallback to heuristic analysis when AI is not configured
        const heur = heuristicTopics(
          questions.map((q) => ({ text: q.text, options: q.options }))
        );
        resultPayload = { ...heur } as any;
      } else {
        const sample = questions.map((q, i) => ({
          i: i + 1,
          text: q.text,
          options: q.options,
        }));
        const prompt = `Aşağıdaki İngilizce çoktan seçmeli soruları analiz et.
1) Konu başlıklarına göre grupla (en fazla 6 konu). Her konu için soru sayısı ve yüzde ver.
2) Dilbilgisi alt konularını çıkar (ör: Tenses, Conditionals, Prepositions, Articles, Modal Verbs, Passive Voice, Relative Clauses, Gerund/Infinitive, Comparatives). Her biri için soru sayısı ve yüzde ver.
3) Zorluk dağılımını tahmin et: seviyeler sadece şunlardan biri olmalı: "çok kolay", "kolay", "orta", "zor", "çok zor". Her seviye için yüzde ve adet ver, ayrıca genel zorluk (overall) seviyesini seç.
4) Öğrenci için "kazanımlar" üret: kısa bir özet, 3-5 maddelik bullet ve 2-3 pratik ipucu.
Sadece aşağıdaki JSON formatında cevap ver.
Sorular: ${JSON.stringify(sample)}

Yanıt JSON şeması:
{
  "topics": [ { "name": "Konu", "count": 12, "percentage": 40 } ],
  "total": 30,
  "grammar": [ { "name": "Tenses", "count": 8, "percentage": 27 } ],
  "difficulty": {
    "distribution": [ { "level": "orta", "count": 10, "percentage": 50 } ],
    "overall": "orta"
  },
  "gains": {
    "summary": "Kısa Türkçe özet",
    "bullets": ["madde1", "madde2"],
    "tips": ["ipucu1", "ipucu2"]
  }
}`;
        try {
          const ai = await gemini.generateContent(prompt);
          let text = ai.response.text().trim();
          text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) text = jsonMatch[0];
          const parsed = JSON.parse(text);
          if (parsed?.topics?.length) {
            // sanitize values
            const total = parsed.total || questions.length;
            const topics: TopicItem[] = parsed.topics
              .map((t: any) => ({
                name: String(t.name).slice(0, 40),
                count: Number(t.count) || 0,
                percentage: Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(
                      Number(t.percentage) || (Number(t.count) / total) * 100
                    )
                  )
                ),
              }))
              .sort((a: TopicItem, b: TopicItem) => b.count - a.count);
            const gains: Gains | undefined = parsed.gains
              ? {
                  summary: parsed.gains.summary
                    ? String(parsed.gains.summary).slice(0, 400)
                    : undefined,
                  bullets: Array.isArray(parsed.gains.bullets)
                    ? parsed.gains.bullets
                        .slice(0, 6)
                        .map((x: any) => String(x).slice(0, 140))
                    : undefined,
                  tips: Array.isArray(parsed.gains.tips)
                    ? parsed.gains.tips
                        .slice(0, 5)
                        .map((x: any) => String(x).slice(0, 140))
                    : undefined,
                }
              : undefined;
            const grammar: GrammarItem[] | undefined = Array.isArray(
              parsed.grammar
            )
              ? parsed.grammar
                  .map((g: any) => ({
                    name: String(g.name).slice(0, 40),
                    count: Number(g.count) || 0,
                    percentage: Math.min(
                      100,
                      Math.max(
                        0,
                        Math.round(
                          Number(g.percentage) ||
                            (Number(g.count) / total) * 100
                        )
                      )
                    ),
                  }))
                  .sort((a: GrammarItem, b: GrammarItem) => b.count - a.count)
                  .slice(0, 8)
              : undefined;
            const difficulty =
              parsed.difficulty && Array.isArray(parsed.difficulty.distribution)
                ? {
                    distribution: parsed.difficulty.distribution
                      .map((d: any) => ({
                        level: String(
                          d.level
                        ).toLowerCase() as DifficultyItem["level"],
                        count: Number(d.count) || 0,
                        percentage: Math.min(
                          100,
                          Math.max(0, Math.round(Number(d.percentage) || 0))
                        ),
                      }))
                      .filter((d: DifficultyItem) =>
                        [
                          "çok kolay",
                          "kolay",
                          "orta",
                          "zor",
                          "çok zor",
                        ].includes(d.level)
                      )
                      .sort(
                        (a: DifficultyItem, b: DifficultyItem) =>
                          [
                            "çok kolay",
                            "kolay",
                            "orta",
                            "zor",
                            "çok zor",
                          ].indexOf(a.level) -
                          [
                            "çok kolay",
                            "kolay",
                            "orta",
                            "zor",
                            "çok zor",
                          ].indexOf(b.level)
                      ),
                    overall: parsed.difficulty.overall
                      ? (String(
                          parsed.difficulty.overall
                        ).toLowerCase() as DifficultyItem["level"])
                      : undefined,
                  }
                : undefined;
            resultPayload = { topics, total, gains, grammar, difficulty };
          }
        } catch (e) {
          // If AI fails, gracefully fall back to heuristic analysis
          const heur = heuristicTopics(
            questions.map((q) => ({ text: q.text, options: q.options }))
          );
          resultPayload = { ...heur } as any;
        }
      }

      if (!resultPayload) {
        return res.status(500).json({ error: "AI returned empty result" });
      }
      // If the series aims to have 20 questions, keep percentages based on actual total,
      // but expose total label as min(actualTotal, 20) to align with your UX goal.
      const actualTotal = resultPayload.total;
      const displayTotal = actualTotal >= 20 ? 20 : actualTotal;
      const payloadOut = { ...resultPayload, total: displayTotal } as any;
      setCache(key, payloadOut);

      // Upsert persisted preview for specific filters (handle nullable composite keys)
      try {
        const catId = where.categoryId ?? null;
        const serId = where.seriesId ?? null;
        const payloadSource = (resultPayload as any).difficulty
          ? "ai"
          : "heuristic";
        if (catId && serId) {
          // Both sides present: safe to use composite unique upsert
          await prisma.examPreview.upsert({
            where: {
              categoryId_seriesId: { categoryId: catId, seriesId: serId },
            },
            update: { total: resultPayload.total, source: payloadSource },
            create: {
              categoryId: catId,
              seriesId: serId,
              total: resultPayload.total,
              alternatives: "[]",
              source: payloadSource,
            },
          });
        } else if (catId && !serId) {
          // Only categoryId present: cannot upsert on composite with null. Do findFirst then update/create.
          const existing = await prisma.examPreview.findFirst({
            where: { categoryId: catId, seriesId: null },
          });
          if (existing) {
            await prisma.examPreview.update({
              where: { id: existing.id },
              data: { total: resultPayload.total, source: payloadSource },
            });
          } else {
            await prisma.examPreview.create({
              data: {
                categoryId: catId,
                seriesId: null,
                total: resultPayload.total,
                alternatives: "[]",
                source: payloadSource,
              },
            });
          }
        } else if (!catId && serId) {
          // Only seriesId present
          const existing = await prisma.examPreview.findFirst({
            where: { categoryId: null, seriesId: serId },
          });
          if (existing) {
            await prisma.examPreview.update({
              where: { id: existing.id },
              data: { total: resultPayload.total, source: payloadSource },
            });
          } else {
            await prisma.examPreview.create({
              data: {
                categoryId: null,
                seriesId: serId,
                total: resultPayload.total,
                alternatives: "[]",
                source: payloadSource,
              },
            });
          }
        }
      } catch (persistErr) {
        console.warn("preview persist failed:", (persistErr as Error).message);
      }
      res.json(payloadOut);
    } catch (error) {
      console.error("topics.preview error", error);
      res.status(500).json({ error: "Failed to build topic preview" });
    }
  },
};

export default TopicsController;
