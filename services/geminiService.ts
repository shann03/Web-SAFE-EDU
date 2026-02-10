
import { GoogleGenAI, Type } from "@google/genai";

// Analyze student behavioral history using Gemini API
// Upgraded to gemini-3-pro-preview for advanced reasoning on behavioral data
export const getBehavioralInsight = async (studentHistory: any[]) => {
  // Always use a named parameter with process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Based on the following student incident history, provide a professional behavioral analysis 
    and suggest potential intervention strategies. Keep it constructive and focused on educational growth.
    
    History:
    ${JSON.stringify(studentHistory)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "A brief professional analysis of patterns." },
            riskLevel: { type: Type.STRING, description: "Low, Medium, or High risk of reoccurrence." },
            suggestedInterventions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["analysis", "riskLevel", "suggestedInterventions"]
        }
      }
    });

    // Use property .text directly; add fallback in case of undefined
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      analysis: "Unable to generate AI analysis at this time. Please review incidents manually.",
      riskLevel: "Unknown",
      suggestedInterventions: ["Consult with a school counselor.", "Notify parents."]
    };
  }
};
