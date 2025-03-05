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

  private handlePredefinedQueries(symptoms: string): string | null {
    const lowerCaseSymptoms = symptoms.toLowerCase().trim();
    console.log("Checking predefined query:", lowerCaseSymptoms);

    // Check for variations of "What is Healio?"
    if (lowerCaseSymptoms.includes("what is healio") || lowerCaseSymptoms === "what's healio" || lowerCaseSymptoms === "what is healio?") {
      return "HEALIO provides features such as monitoring health indicators (heart rate, blood pressure, ...), scheduling appointments, online consultation with doctors, storing medical records, and more.";
    }

    // Check for variations of tired symptoms
    const tiredPhrases = ["today im so tired", "i'm tired", "im tired", "feeling tired", "i am tired"];
    if (tiredPhrases.some(phrase => lowerCaseSymptoms.includes(phrase))) {
      return "If you feel tired due to work, maybe you need a break, relax after stressful working hours and find something delicious to eat, you will feel better or if the fatigue does not come from being busy with work, please provide more information so that I can analyze and diagnose you as soon as possible";
    }

    console.log("No predefined response found");
    return null;
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
    try {
      // Check for predefined responses first
      const predefinedResponse = this.handlePredefinedQueries(symptoms);
      if (predefinedResponse) {
        console.log("Returning predefined response");
        return predefinedResponse;
      }

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
    } catch (error) {
      console.error("Error in analyzeSymptoms:", error);
      throw error;
    }
  }
}

export const aiService = new AIService();