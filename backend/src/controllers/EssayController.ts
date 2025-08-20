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
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
      const { essayText } = req.body;

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
      const prompt = `Sen bir IELTS sınavı değerlendirme uzmanısın. Aşağıdaki essay'i IELTS yazım kriterlerine göre değerlendir.
Her kategori için 1-10 arası puan ver:
- Task Response (Görev Yanıtı)
- Coherence and Cohesion (Tutarlılık ve Bağlantı)
- Lexical Resource (Kelime Dağarcığı)
- Grammatical Range and Accuracy (Dilbilgisi Doğruluğu)

Genel puanı 0-100 arası hesapla ve yapıcı geri bildirim ver.

Essay: ${essayText}

Lütfen sadece aşağıdaki JSON formatında yanıtla:
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

      // Call Gemini API
      const gemini = getGeminiClient();

      if (!gemini) {
        return res.status(500).json({
          error:
            "Gemini API key is not configured. Please add your API key to the .env file.",
        });
      }

      const result = await gemini.generateContent(prompt);
      const responseText = result.response.text();

      if (!responseText) {
        throw new Error("No response from Gemini");
      }

      console.log("Gemini raw response:", responseText);

      // Clean the response to extract JSON
      let cleanedResponse = responseText.trim();

      // Remove markdown code blocks if present
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      // Find JSON object in the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }

      // Parse the JSON response
      let evaluation: EssayEvaluation;
      try {
        evaluation = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", cleanedResponse);
        throw new Error("Invalid response format from AI");
      }

      // Validate the response structure
      if (!evaluation.scores || !evaluation.feedback) {
        throw new Error("Invalid evaluation structure");
      }

      // Ensure all scores are valid
      const scores = evaluation.scores;
      const scoreKeys = [
        "task_response",
        "coherence_cohesion",
        "lexical_resource",
        "grammar",
      ];

      for (const key of scoreKeys) {
        const score = scores[key as keyof EssayScores];
        if (typeof score !== "number" || score < 1 || score > 10) {
          throw new Error(`Invalid score for ${key}: ${score}`);
        }
      }

      // Validate overall score (0-100)
      if (
        typeof scores.overall !== "number" ||
        scores.overall < 0 ||
        scores.overall > 100
      ) {
        // Calculate overall score from sub-scores (convert 1-10 to 0-100 scale)
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
      res.json(evaluation);
    } catch (error: any) {
      console.error("Essay evaluation error:", error);

      if (error.message?.includes("API key")) {
        return res.status(500).json({
          error: "Gemini API configuration error",
        });
      }

      res.status(500).json({
        error: "Failed to evaluate essay",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
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
