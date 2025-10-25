import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const getGeminiClient = () => {
  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your-gemini-api-key-here"
  ) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

interface EssayScores {
  task_response: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammar: number;
  overall: number;
}

interface EssayEvaluation {
  scores: EssayScores;
  feedback: string;
}

const EssayController = {
  evaluateEssay: async (req: Request, res: Response) => {
    try {
      const { essayText, topic } = req.body;

      if (!essayText || typeof essayText !== "string") {
        return res.status(400).json({
          error: "Essay text is required and must be a string",
        });
      }

      if (essayText.trim().length < 50) {
        return res.status(400).json({
          error: "Essay must be at least 50 characters long",
        });
      }

      // Prepare the prompt for Gemini
      const prompt = `Sen bir IELTS sınavı yazılı değerlendirme uzmanısın. Sana verilen essay'i, verilen konuya uygunluk açısından ve IELTS yazma kriterlerine göre değerlendirmeni istiyorum. Lütfen aşağıdaki kurallara kesinlikle uy:

1. Essay'in verilen konuya ne kadar uygun olduğunu (Task Response) değerlendir. Konudan sapma, alakasız içerik veya eksik yanıt varsa puanı düşür.
2. Coherence and Cohesion (Tutarlılık ve Bağlantı): Paragraflar arası ve cümleler arası mantıklı geçişleri, bağlaç ve bağlantı kelimelerinin kullanımını değerlendir.
3. Lexical Resource (Kelime Dağarcığı): Farklı ve uygun kelime kullanımı, akademik kelimeler, tekrar eden kelimelerden kaçınma.
4. Grammatical Range and Accuracy (Dilbilgisi): Farklı gramer yapıları, doğru zaman ve cümle yapısı, dilbilgisi hataları.
5. Genel puan (overall): Tüm kriterlerin ortalamasına göre 0-100 arası bir puan ver.

Her kategori için 1-10 arası puan ver. Geri bildirimi detaylı, yapıcı ve tamamen Türkçe olarak yaz. Geri bildirimin essayin içeriğiyle ve verilen konuyla doğrudan ilgili olsun, genel geçer veya alakasız yorumlar yapma. Essay metnini dikkatlice oku ve sadece verilen konuya odaklan.

Konu: ${topic || "(konu belirtilmedi)"}
Essay: ${essayText}

Yanıtı sadece aşağıdaki JSON formatında ver:
{
  "scores": {
    "task_response": [1-10 arası puan],
    "coherence_cohesion": [1-10 arası puan],
    "lexical_resource": [1-10 arası puan],
    "grammar": [1-10 arası puan],
    "overall": [0-100 arası genel puan]
  },
  "feedback": "Detaylı Türkçe geri bildirim buraya"
}`;

      // Helper: Heuristic fallback scoring (no AI)
      const heuristicEvaluate = (text: string): EssayEvaluation => {
        const words = text.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const sentences = text
          .split(/[.!?]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const sentenceCount = sentences.length || 1;
        const avgSentence = wordCount / sentenceCount;
        const uniqueWords = new Set(
          words.map((w) => w.toLowerCase().replace(/[^a-z']/g, ""))
        );
        const uniqueRatio = uniqueWords.size / Math.max(1, wordCount);
        const longWords = words.filter(
          (w) => w.replace(/[^a-z]/gi, "").length >= 7
        ).length;
        const longRatio = longWords / Math.max(1, wordCount);
        const connectors = (
          text.match(
            /\b(however|moreover|therefore|because|although|furthermore|in addition|on the other hand)\b/gi
          ) || []
        ).length;
        const turkishChars = (text.match(/[ığüşöçİĞÜŞÖÇ]/g) || []).length;
        // Topic relevance: simple keyword overlap heuristic
        let topicBoost = 0;
        if (typeof topic === "string" && topic.trim()) {
          const tks = topic
            .toLowerCase()
            .split(/[^a-z]+/)
            .filter(
              (x) =>
                x &&
                x.length > 2 &&
                ![
                  "the",
                  "and",
                  "for",
                  "are",
                  "you",
                  "with",
                  "that",
                  "this",
                  "have",
                  "from",
                  "was",
                  "were",
                  "your",
                  "our",
                  "their",
                  "has",
                  "had",
                  "but",
                  "not",
                  "all",
                  "any",
                  "can",
                  "who",
                  "what",
                  "when",
                  "where",
                  "why",
                  "how",
                  "into",
                  "onto",
                  "over",
                  "under",
                  "out",
                  "off",
                  "did",
                  "does",
                  "do",
                  "been",
                  "being",
                  "than",
                  "then",
                  "also",
                ].includes(x)
            );
          const essayTokens = new Set(
            text
              .toLowerCase()
              .split(/[^a-z]+/)
              .filter((x) => x)
          );
          const overlap = tks.filter((t) => essayTokens.has(t)).length;
          topicBoost = Math.min(
            3,
            Math.floor(overlap / Math.max(1, Math.round(tks.length / 3)))
          );
        }

        const clamp = (v: number, min: number, max: number) =>
          Math.max(min, Math.min(max, v));
        const to10 = (v: number) => clamp(Math.round(v), 1, 10);

        // Task response: length and average sentence length
        let trScore =
          4 +
          (wordCount >= 100 ? 1 : 0) +
          (wordCount >= 150 ? 1 : 0) +
          (wordCount >= 200 ? 1 : 0) +
          (wordCount >= 250 ? 2 : 0);
        trScore += avgSentence >= 12 ? 1 : 0;
        trScore += topicBoost; // reward topic relevance in task response
        trScore = to10(trScore);

        // Coherence & cohesion: connectors and sentence structure
        let ccScore =
          4 +
          Math.min(4, Math.floor(connectors / 2)) +
          (sentenceCount >= 6 ? 1 : 0);
        ccScore += avgSentence >= 10 && avgSentence <= 25 ? 1 : 0;
        ccScore = to10(ccScore);

        // Lexical resource: unique ratio and long word ratio
        let lrScore =
          4 + Math.round(uniqueRatio * 6) + (longRatio > 0.12 ? 1 : 0);
        lrScore = to10(lrScore);

        // Grammar: basic heuristic + penalty for Turkish chars
        const startsCapital = sentences.filter((s) =>
          /^[A-Z]/.test(s.trim())
        ).length;
        let grScore =
          4 + (startsCapital >= Math.min(5, sentenceCount - 1) ? 2 : 1);
        grScore += avgSentence <= 30 ? 1 : 0;
        grScore -= turkishChars > 5 ? 2 : turkishChars > 0 ? 1 : 0;
        grScore = to10(grScore);

        // Eğer konuya hiç değinilmiyorsa (topicBoost 0), task_response ve overall puanını 1'e çek
        if (topicBoost === 0) {
          trScore = 1;
        }

        let overall = clamp(
          Math.round(((trScore + ccScore + lrScore + grScore) / 4) * 10),
          0,
          100
        );
        if (topicBoost === 0) {
          overall = 1;
        }

        const feedback = [
          `Metin uzunluğu: ${wordCount} kelime, ${sentenceCount} cümle. Ortalama cümle uzunluğu ${avgSentence.toFixed(
            1
          )} kelime.`,
          topic
            ? `Konu: "${topic}". Anahtar kavramlarla örtüşme ${
                topicBoost > 0 ? "fena değil" : "zayıf"
              }.`
            : undefined,
          connectors >= 2
            ? `Bağlaç kullanımı yeterli (ör. however, moreover, because).`
            : `Bağlaç kullanımını artırın (ör. however, moreover, because).`,
          uniqueRatio > 0.5
            ? `Kelime çeşitliliği iyi (benzersiz kelime oranı ${(
                uniqueRatio * 100
              ).toFixed(0)}%).`
            : `Daha çeşitli kelimeler kullanın (benzersiz oran ${(
                uniqueRatio * 100
              ).toFixed(0)}%).`,
          longRatio > 0.12
            ? `Akademik kelime kullanımı fena değil (uzun kelime oranı ${(
                longRatio * 100
              ).toFixed(0)}%).`
            : `Akademik kelime dağarcığınızı geliştirin (uzun kelime oranı ${(
                longRatio * 100
              ).toFixed(0)}%).`,
          turkishChars > 0
            ? `Yabancı dil karakterleriyle (ı,ğ,ş,ç,ö,ü) yazmaktan kaçının: ${turkishChars} karakter bulundu.`
            : `Yabancı dil karakter kullanımı uygun.`,
        ]
          .filter(Boolean)
          .join("\n\n");

        return {
          scores: {
            task_response: trScore,
            coherence_cohesion: ccScore,
            lexical_resource: lrScore,
            grammar: grScore,
            overall,
          },
          feedback,
        };
      };

      // Try Gemini first, then fallback gracefully
      const gemini = getGeminiClient();
      try {
        if (!gemini) {
          const heuristic = heuristicEvaluate(essayText);
          return res.json(heuristic);
        }

        const result = await gemini.generateContent(prompt);
        const responseText = result.response.text();
        if (!responseText) throw new Error("No response from Gemini");

        console.log("Gemini raw response:", responseText);
        let cleanedResponse = responseText.trim();
        cleanedResponse = cleanedResponse
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanedResponse = jsonMatch[0];

        let evaluation: EssayEvaluation = JSON.parse(cleanedResponse);

        if (!evaluation.scores || !evaluation.feedback)
          throw new Error("Invalid evaluation structure");

        const scores = evaluation.scores;
        const scoreKeys = [
          "task_response",
          "coherence_cohesion",
          "lexical_resource",
          "grammar",
        ];
        for (const key of scoreKeys) {
          const score = (scores as any)[key];
          if (typeof score !== "number" || score < 1 || score > 10) {
            throw new Error(`Invalid score for ${key}: ${score}`);
          }
        }
        // Eğer AI'dan gelen task_response veya coherence_cohesion 2 veya daha düşükse, overall puanını 1'e çek
        if (
          (typeof scores.task_response === "number" &&
            scores.task_response <= 2) ||
          (typeof scores.coherence_cohesion === "number" &&
            scores.coherence_cohesion <= 2)
        ) {
          scores.overall = 1;
        } else if (
          typeof scores.overall !== "number" ||
          scores.overall < 0 ||
          scores.overall > 100
        ) {
          scores.overall = Math.round(
            ((scores.task_response +
              scores.coherence_cohesion +
              scores.lexical_resource +
              scores.grammar) /
              4) *
              10
          );
        }

        console.log("Essay evaluation completed successfully");
        return res.json(evaluation);
      } catch (aiErr) {
        console.warn("Gemini failed, using heuristic fallback:", aiErr);
        const heuristic = heuristicEvaluate(essayText);
        return res.json(heuristic);
      }
    } catch (error: any) {
      console.error("Essay evaluation error:", error);
      // As a last resort, return a minimal heuristic to avoid breaking UX
      try {
        const text = String(req.body?.essayText || "");
        const minimal: EssayEvaluation = {
          scores: {
            task_response: 5,
            coherence_cohesion: 5,
            lexical_resource: 5,
            grammar: 5,
            overall: 50,
          },
          feedback: text
            ? "Otomatik değerlendirme sınırlı modda yapıldı. Daha uzun ve bağlantılı cümleler, çeşitli kelime kullanımı ve dilbilgisi doğruluğuna dikkat edin."
            : "Metin bulunamadı.",
        };
        return res.json(minimal);
      } catch {
        return res.status(500).json({ error: "Failed to evaluate essay" });
      }
    }
  },

  // Health check endpoint for essay service
  healthCheck: async (req: Request, res: Response) => {
    try {
      // Test Gemini connection
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          status: "error",
          message: "Gemini API key not configured",
        });
      }

      res.json({
        status: "ok",
        message: "Essay evaluation service is running",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Essay evaluation service is not available",
      });
    }
  },
};

export default EssayController;
