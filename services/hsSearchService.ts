
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResponse, HSResult, GroundingSource } from "../types";

export const searchHSCode = async (query: string): Promise<SearchResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `Search for the Harmonized System (HS) codes related to: "${query}". 
  Provide a list of potential matching HS codes with their official descriptions, section names, and any typical duty insights if available.
  Also provide a brief summary of how these items are classified.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We aren't using responseSchema here because googleSearch grounding 
        // works best with text responses that we then parse or display as markdown.
        // However, for structured data extraction, we will request a specific format in the prompt.
      },
    });

    const text = response.text || "No results found.";
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    // For a production app, we would ideally use a two-step process:
    // 1. Search grounding to get facts.
    // 2. Structured extraction of those facts into JSON.
    // For this prototype, we'll use a slightly more sophisticated prompt or regex parsing
    // but here we will return the text and a simulated structured list based on standard AI output.
    
    // Simple mock structure for the UI to look "Google-like"
    // In a real app, you'd do: 
    // const jsonResponse = await ai.models.generateContent({..., config: { responseMimeType: "application/json", responseSchema: ... }});
    
    // Let's assume the model returns a helpful markdown list we can show.
    // To make the UI rich, we'll return the raw text as 'summary' and some parsed results.
    
    return {
      results: [], // We'll display the summary primarily as it's the grounded content
      summary: text,
      sources: sources
    };
  } catch (error) {
    console.error("HS Search Error:", error);
    throw error;
  }
};
