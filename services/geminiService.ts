
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyze student behavioral history using Gemini 3 Pro.
 * Utilizes the new thinkingBudget to allow the model more reasoning time 
 * for complex behavioral pattern recognition in educational settings.
 */
export const getBehavioralInsight = async (studentHistory: any[]) => {
  // Initialize right before use to ensure the latest API key context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert educational psychologist and behavioral analyst. 
    Analyze the following student incident history and provide a professional, 
    constructive assessment. Focus on identifying triggers, patterns, and 
    positive growth opportunities.
    
    Student Incident Data:
    ${JSON.stringify(studentHistory)}
    
    Format your response as a JSON object that adheres to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        // Behavioral analysis benefits from deeper reasoning time
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { 
              type: Type.STRING, 
              description: "Professional psych-educational analysis of the behavior patterns observed." 
            },
            riskLevel: { 
              type: Type.STRING, 
              description: "Assessment of risk (Low, Medium, High) for future behavioral escalations." 
            },
            suggestedInterventions: {
              type: Type.ARRAY,
              description: "Actionable, evidence-based strategies for teachers and counselors.",
              items: { type: Type.STRING }
            },
            growthFocus: {
              type: Type.STRING,
              description: "A specific area of focus for the student's personal development and positive reinforcement."
            }
          },
          required: ["analysis", "riskLevel", "suggestedInterventions", "growthFocus"]
        }
      }
    });

    // Directly access the .text property from the GenerateContentResponse object
    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      analysis: "Automated analysis encountered an error. Please manually review the case logs to determine if further intervention is required.",
      riskLevel: "Undetermined",
      suggestedInterventions: [
        "Schedule a primary consultation with the student.",
        "Verify parental contact details for notification.",
        "Review digital safety logs for related flags."
      ],
      growthFocus: "General self-regulation and peer communication."
    };
  }
};
