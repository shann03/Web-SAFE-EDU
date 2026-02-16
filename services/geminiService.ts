
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyze student behavioral history using Gemini 3 Pro.
 * Adheres to strict @google/genai SDK guidelines.
 */
export const getBehavioralInsight = async (studentHistory: any[]) => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is missing.");
    return fallbackResponse("API Access restricted.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert educational psychologist. 
    Analyze the following student incident history and provide a professional assessment.
    
    Student Incident Data:
    ${JSON.stringify(studentHistory)}
    
    Format your response as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash for faster insights
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            suggestedInterventions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            growthFocus: { type: Type.STRING }
          },
          required: ["analysis", "riskLevel", "suggestedInterventions", "growthFocus"]
        }
      }
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return fallbackResponse("Automated analysis failed. Manual review of case logs is required.");
  }
};

const fallbackResponse = (msg: string) => ({
  analysis: msg,
  riskLevel: "Undetermined",
  suggestedInterventions: ["Verify primary student contact details.", "Schedule observation period."],
  growthFocus: "General self-regulation focus recommended."
});
