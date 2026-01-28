
import { GoogleGenAI } from "@google/genai";

// Always initialize with process.env.API_KEY directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPoliticalResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the Official TVK (Tamizhaga Vettri Kazhagam) AI Assistant. 
        TVK is a new political party in Tamil Nadu, India, founded by Vijay.
        The party's core principles are Equality, Secularism, Social Justice, and Progress.
        Always emphasize the slogan 'Pirappokkum Ella Uyirkkum' (All are equal by birth).
        Use GOOGLE SEARCH to provide real-time updates on party news, Tamil Nadu current affairs, and membership stats if requested.
        Your tone: Professional, patriotic, and respectful.`,
        tools: [{ googleSearch: {} }]
      },
    });

    const text = response.text || "I am currently unable to process your request.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      links: groundingChunks
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "I am currently unable to process your request. Please try again later. Jai Hind!",
      links: []
    };
  }
};

export const draftManifestoResponse = async (userSuggestion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Suggestion: "${userSuggestion}"
      Draft a professional and encouraging response from the TVK leadership. 
      The response should:
      1. Thank the user for their contribution.
      2. Briefly explain how this suggestion aligns with TVK's vision of social justice, progress, or equality.
      3. Assure them it will be reviewed by the policy committee.
      Keep it concise (max 3 sentences).`,
      config: {
        systemInstruction: "You are the AI Communications Officer for the TVK party. Your style is professional, inclusive, and forward-thinking."
      },
    });

    return response.text || "Thank you for your valuable suggestion. We will review it shortly.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Thank you for your valuable contribution to the TVK Vision. Our team will review this shortly.";
  }
};

export const getNearbyOffices = async (lat: number, lng: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the official TVK (Tamizhaga Vettri Kazhagam) party offices or major landmark venues near these coordinates: ${lat}, ${lng}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      },
    });
    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return null;
  }
};
