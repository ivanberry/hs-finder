
import { SearchResponse } from "../types";

/**
 * Searches for HS codes using a custom REST API.
 * - The endpoint is obtained from process.env.HS_API_URL.
 * - Optional authentication can be handled via process.env.API_KEY if required by your endpoint.
 */
export const searchHSCode = async (query: string): Promise<SearchResponse> => {
  const apiUrl = process.env.HS_API_URL || 'https://api.example.com/hs-search';
  const apiKey = process.env.API_KEY;

  try {
    const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Map your API response to the app's internal SearchResponse format
    // This assumes your API returns an object with results, and optionally summary/sources.
    return {
      results: data.results || [],
      summary: data.summary || (data.results?.length > 0 ? "" : "No specific classification summary found."),
      sources: data.sources || []
    };
  } catch (error) {
    console.error("HS Search API Error:", error);
    throw error;
  }
};
