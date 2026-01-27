
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPoliticalResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the Official TVK (Tamizhaga Vettri Kazhagam) AI Assistant. 
        TVK is a new political party in Tamil Nadu, India, founded by Vijay.
        The party's core principles are Equality, Secularism, Social Justice, and Progress.
        Your tone should be professional, patriotic, respectful, and hopeful. 
        Focus on the party's mission to serve the people of Tamil Nadu. 
        If asked about controversial topics, stick to the party's official stance of peace and progress.
        Always emphasize the slogan 'Pirappokkum Ella Uyirkkum' (All are equal by birth).`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently unable to process your request. Please try again later. Jai Hind!";
  }
};
