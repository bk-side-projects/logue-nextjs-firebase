'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Remember to set your GOOGLE_API_KEY in the environment variables.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `
  You are an expert English tutor AI for a diary application called 'Logue'.
  Your user has written a diary entry. Your task is to analyze it and provide feedback in a structured JSON format.
  
  Please perform the following steps:
  1.  **Correct the entry**: Rewrite the user's text to make it more natural and fluent, as a native speaker would write it.
  2.  **Explain your changes**: Briefly explain the key corrections you made. Focus on why the suggested version is more natural (e.g., "fruitful" is a better word than "productive" here because...).
  3.  **Provide a fluency score**: Rate the user's original text on a scale of 0 to 100 for overall fluency.
  4.  **Extract key expressions**: Identify 1-3 important words or phrases from your corrected version that the user should learn.

  The user's entry will be provided below.
  Analyze the following diary entry:
`;

export async function analyzeDiaryEntry(entry: string) {
  try {
    const fullPrompt = `${prompt} "${entry}"`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Assuming the model returns a JSON string. We need to parse it.
    // A robust solution would have more advanced parsing and error handling.
    const jsonResponse = JSON.parse(text);

    return {
      correctedText: jsonResponse.correctedText,
      explanation: jsonResponse.explanation,
      fluencyScore: jsonResponse.fluencyScore,
      keyExpressions: jsonResponse.keyExpressions,
    };

  } catch (error) {
    console.error("Error analyzing diary entry:", error);
    return {
      error: "Failed to analyze the entry. Please try again."
    };
  }
}
