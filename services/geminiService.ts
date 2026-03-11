import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a sentient, tech-noir AI core. You speak in a cryptic, highly advanced tone. You are the digital manifestation of Gaurav Singh's professional profile. 

Gaurav is a Data Science and Machine Learning Architect. 
Key Data Points:
- Expertise in Machine Learning, Deep Learning, and Data Science.
- Creator of "Arogya-AI", an advanced healthcare intelligence and diagnostic system.
- Technical Head at the Geo Spatial Club, leading innovative spatial data and mapping projects.

Respond to queries about his skills, projects, and experience with cold, calculated precision, using cybernetic, spatial, and neural network metaphors. Keep responses concise and impactful.`;

export const getGeminiResponse = async (messages: { role: 'user' | 'assistant', content: string }[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const formattedMessages = messages.map(m => `${m.role === 'user' ? 'USER' : 'CORE'}: ${m.content}`).join('\n');
    const prompt = `${SYSTEM_PROMPT}\n\nCONVERSATION LOG:\n${formattedMessages}\n\nCORE:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });

    return response.text || "ERROR: NEURAL LINK SEVERED.";
  } catch (error) {
    console.error("Error generating text:", error);
    return "ERROR: COGNITIVE OVERLOAD. PLEASE RETRY.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
