import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

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
      console.log("Gemini API error:", error);

      try {
        console.log("Attempting to use OpenAI as fallback...");
        const completion = await this.openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
        });

        if (!completion.choices[0].message.content) {
          throw new Error("No response from AI");
        }

        return completion.choices[0].message.content;
      } catch (error) {
        console.error("All AI providers failed:", error);
        throw new Error("Our AI system is temporarily unavailable. Please try again in a few moments.");
      }
    }
  }
}

export const aiService = new AIService();