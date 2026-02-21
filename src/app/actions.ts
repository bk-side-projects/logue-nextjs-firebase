'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount || '{}')),
    });
  } catch (e) {
    console.error('Firebase Admin initialization error', e);
  }
}

const db = getFirestore();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export type AnalysisFeedback = {
  original: string;
  suggestion: string;
  explanation: string;
  isPerfect: boolean;
};

export type AIAnalysisResponse = {
  feedback: AnalysisFeedback[];
  overallScore: number;
  summary: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export async function analyzeDiaryEntry(
  prevState: any,
  formData: FormData
): Promise<(AIAnalysisResponse & { id: string }) | { error: string }> {
  const diaryContentHtml = formData.get('diaryContent') as string;
  const uid = formData.get('uid') as string;

  if (!uid) return { error: 'User not authenticated.' };
  if (!diaryContentHtml || stripHtml(diaryContentHtml).trim().length < 10) {
    return { error: 'Diary content is too short.' };
  }

  const diaryContent = stripHtml(diaryContentHtml);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
        You are an expert English tutor AI named \"Logue\". Analyze the following diary entry sentence by sentence.
        For each sentence, provide: {original, suggestion, explanation, isPerfect: boolean}.
        After analyzing all sentences, provide: {overallScore (0-100), summary}.
        Return as a single valid JSON object: { feedback: [...], overallScore: ..., summary: ... }.
        User Entry: \"${diaryContent}\"
    `;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResponse: AIAnalysisResponse = JSON.parse(cleanedJson);

    const entryRef = db.collection('users').doc(uid).collection('entries').doc();
    await entryRef.set({
        id: entryRef.id,
        originalContent: diaryContentHtml,
        analysis: parsedResponse,
        createdAt: new Date(),
    });

    return { ...parsedResponse, id: entryRef.id };
  } catch (error) {
    console.error("AI/DB Error:", error);
    return { error: "Analysis or saving failed. Please try again." };
  }
}

export async function saveToVault(uid: string, text: string): Promise<{ success: boolean; error?: string }> {
    if (!uid) return { success: false, error: "User not authenticated." };
    if (!text) return { success: false, error: "Cannot save an empty item." };

    try {
        const vaultRef = db.collection('users').doc(uid).collection('vault').doc();
        await vaultRef.set({
            id: vaultRef.id,
            text: text,
            createdAt: new Date(),
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to save to vault:", error);
        return { success: false, error: "Failed to save item to your vault." };
    }
}
