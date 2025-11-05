import { GoogleGenAI } from "@google/genai";
import { ProjectDetails, CandidateProduct, SystemRecommendation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

export const generateRecommendation = async (
  systemPrompt: string,
  projectDetails: ProjectDetails,
  candidateProducts: CandidateProduct[]
): Promise<SystemRecommendation> => {

  const fullPrompt = `
    ${systemPrompt}

    INPUT FIELDS:
    ${JSON.stringify({
      ...projectDetails,
      candidate_products: candidateProducts.map(({ id, ...rest }) => rest), // remove internal ID
    }, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
    });
    
    // Clean the response text to ensure it's valid JSON
    const jsonText = response.text.trim().replace(/^```json|```$/g, '').trim();

    const result = JSON.parse(jsonText) as SystemRecommendation;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. The format might be invalid.");
    }
    throw new Error("Failed to get a recommendation from the AI service.");
  }
};

export const generateProductDescription = async (
    product: Omit<CandidateProduct, 'id'>
): Promise<string> => {
    const prompt = `
        Based on the following product data, write a concise, professional, and technical product description suitable for a data sheet.
        Focus on the key features and typical applications. Do not invent new properties.

        Product Data:
        ${JSON.stringify(product, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating product description:", error);
        throw new Error("Failed to generate product description from AI service.");
    }
};
