
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysis } from '../types';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

const analysisSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      issue: {
        type: Type.STRING,
        description: "The identified skin issue, e.g., 'Acne Vulgaris', 'Hyperpigmentation', 'Scarring'."
      },
      description: {
        type: Type.STRING,
        description: "A brief, user-friendly description of the identified issue."
      },
      food_recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of food items beneficial for this condition."
      },
      medicine_recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of over-the-counter medicines or treatments. Include common brand names if applicable."
      }
    },
    required: ["issue", "description", "food_recommendations", "medicine_recommendations"],
  }
};


export const analyzeSkinImage = async (base64Image: string, mimeType: string): Promise<SkinAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const textPart = {
    text: `Analyze this image of human skin. Identify potential dermatological issues like acne, pimples, scars, pigmentation, moles, or rashes. 
    Based on the visual analysis, provide a list of identified issues. 
    For each issue, recommend suitable food items and over-the-counter medicines or treatments. 
    If the skin appears healthy, return an empty array. 
    Strictly follow the provided JSON schema.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as SkinAnalysis;
    return result;

  } catch (error) {
    console.error("Error analyzing skin image with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The response might be blocked or the API is unavailable.");
  }
};
