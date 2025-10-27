// Type definition for essay evaluation result
type EssayEvaluation = {
  scores: {
    task_response: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammar: number;
    overall: number;
  };
  feedback: string;
};

// Utility functions for score clamping
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const to10 = (v: number) => clamp(Math.round(v), 1, 10);

import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client (returns null if not configured)
const getGeminiClient = () => {
  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "AIzaSyBnVI4KBht0T9uQNKRuzn99BrDZWjbKnPc"
  ) {
    return null;
  }
  // Create and return a client instance (adjust constructor options if needed)
  try {
    // @ts-ignore - library may vary; keep generic instantiation
    return new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch {
    return null;
  }
};

// Helper: Heuristic fallback scoring (no AI)
// Accepts topic explicitly instead of relying on an outer var
const heuristicEvaluate = (text: string, topic?: string): EssayEvaluation => {
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
    4 + Math.min(4, Math.floor(connectors / 2)) + (sentenceCount >= 6 ? 1 : 0);
  ccScore += avgSentence >= 10 && avgSentence <= 25 ? 1 : 0;
  ccScore = to10(ccScore);

  // Lexical resource: unique ratio and long word ratio
  let lrScore = 4 + Math.round(uniqueRatio * 6) + (longRatio > 0.12 ? 1 : 0);
  lrScore = to10(lrScore);

  // Grammar: basic heuristic + penalty for Turkish chars
  const startsCapital = sentences.filter((s) => /^[A-Z]/.test(s.trim())).length;
  let grScore = 4 + (startsCapital >= Math.min(5, sentenceCount - 1) ? 2 : 1);
  grScore += avgSentence <= 30 ? 1 : 0;
  grScore -= turkishChars > 5 ? 2 : turkishChars > 0 ? 1 : 0;
  grScore = to10(grScore);

  // All scores 1-10, overall is average rounded
  const overall = to10((trScore + ccScore + lrScore + grScore) / 4);

  let feedback = "";
  if (topicBoost === 0) {
    feedback = "Konu ile alakasız, puan verilemez.";
  } else {
    feedback = `Otomatik sistem tarafından puanlandı. Metin uzunluğu: ${wordCount} kelime, ${sentenceCount} cümle.`;
  }

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

const EssayController = {
  // Main evaluation endpoint
  evaluate: async (req: Request, res: Response) => {
    // Ensure we have the essay text and topic extracted from the incoming request
    const essayText = String(req.body?.essayText || req.query?.essayText || "");
    const topic = String(req.body?.topic || req.query?.topic || "");

    const prompt = `Sen bir IELTS yazılı sınav değerlendiricisisin. Sana verilen essay'i, verilen konuya uygunluk ve IELTS kriterlerine göre değerlendir. Eğer essay konu ile tamamen alakasızsa veya saçmaysa, tüm puanları 1 ver ve feedback'te "Konu ile alakasız, puan verilemez." yaz. Sadece aşağıdaki JSON formatında yanıt ver:
{
  "scores": {
    "task_response": [1-10],
    "coherence_cohesion": [1-10],
    "lexical_resource": [1-10],
    "grammar": [1-10],
    "overall": [1-10]
  },
  "feedback": "Essay ve konuya göre detaylı Türkçe geri bildirim. Eğer konu dışıysa: 'Konu ile alakasız, puan verilemez.' yaz."
}
Konu: ${topic || "(konu belirtilmedi)"}
Essay: ${essayText}`;

    // Try Gemini first, then fallback gracefully
    const gemini = getGeminiClient();
    try {
      if (!gemini) {
        const heuristic = heuristicEvaluate(essayText, topic);
        return res.json(heuristic);
      }

      const result = await (gemini as any).generateContent(prompt);
      const responseText =
        typeof result?.response?.text === "function"
          ? result.response.text()
          : String(result);
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
      // Ensure overall is 1-10, recalculate if not
      if (
        typeof scores.overall !== "number" ||
        scores.overall < 1 ||
        scores.overall > 10
      ) {
        scores.overall = to10(
          (scores.task_response +
            scores.coherence_cohesion +
            scores.lexical_resource +
            scores.grammar) /
            4
        );
      }

      // If Gemini feedback contains 'Konu ile alakasız', override all scores to 1
      if (evaluation.feedback.toLowerCase().includes("konu ile alakasız")) {
        evaluation = {
          scores: {
            task_response: 1,
            coherence_cohesion: 1,
            lexical_resource: 1,
            grammar: 1,
            overall: 1,
          },
          feedback: "Konu ile alakasız, puan verilemez.",
        };
      }

      console.log("Essay evaluation completed successfully");
      return res.json(evaluation);
    } catch (aiErr) {
      console.warn("Gemini failed, using heuristic fallback:", aiErr);
      const heuristic = heuristicEvaluate(essayText, topic);
      return res.json(heuristic);
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
