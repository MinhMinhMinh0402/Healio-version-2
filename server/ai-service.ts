import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import type { CompletionOptions, CompletionResponse } from "deepseek-api";

type SymptomCategory = 
  | "Head & Neurological" 
  | "Chest & Respiratory" 
  | "Abdominal" 
  | "Musculoskeletal" 
  | "Skin";

interface AIAnalysisRequest {
  category: SymptomCategory;
  symptoms: string;
}

class AIService {
  private gemini: GoogleGenerativeAI;
  private openai: OpenAI;

  constructor() {
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }

  private getPrompt(category: SymptomCategory, symptoms: string): string {
    return `As a medical AI assistant, analyze the following ${category} symptoms and provide a preliminary analysis. Note any potential serious conditions that require immediate medical attention.

Symptoms reported:
${symptoms}

Please provide:
1. Possible causes
2. Recommended actions
3. Urgency level (Low/Medium/High)
4. When to seek immediate medical attention

Remember to emphasize that this is an AI preliminary analysis and not a substitute for professional medical diagnosis.`;
  }

  async analyzeSymptoms({ category, symptoms }: AIAnalysisRequest): Promise<string> {
    const prompt = this.getPrompt(category, symptoms);

    try {
      console.log("Attempting to use Gemini...");
      const model = this.gemini.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.log("Gemini API failed, trying DeepSeek...", error);

      try {
        console.log("Attempting to use DeepSeek...");
        const { default: deepseek } = await import("deepseek-api");
        const options: CompletionOptions = {
          prompt,
          model: "deepseek-chat",
          maxTokens: 1000,
        };
        const result = await deepseek.complete(options);
        return result.choices[0].text;
      } catch (error) {
        console.log("DeepSeek API failed, trying OpenAI...", error);

        try {
          console.log("Attempting to use OpenAI...");
          const completion = await this.openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
          });
          return completion.choices[0].message.content || "Failed to get AI analysis. Please try again later.";
        } catch (error) {
          console.error("All AI providers failed:", error);
          throw new Error("All AI providers are currently unavailable. Please try again later.");
        }
      }
    }
  }
}

export const aiService = new AIService();