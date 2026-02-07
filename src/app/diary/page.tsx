
'use client';

import { useState } from 'react';
import { analyzeDiaryEntry } from './actions';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Defines the shape of a successful analysis
type SuccessAnalysis = {
  correctedText: string;
  explanation: string;
  fluencyScore: number;
  keyExpressions: string[];
};

// Defines the shape of a failed analysis
type ErrorAnalysis = {
  error: string;
};

// The result can be one of the two types above
type AnalysisResult = SuccessAnalysis | ErrorAnalysis;

export default function DiaryPage() {
  const [entry, setEntry] = useState('');
  // The analysis state is now strictly for successful results
  const [analysis, setAnalysis] = useState<SuccessAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!entry.trim()) {
      setError('Please write something in your diary first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Save the original entry to Firestore first.
      await addDoc(collection(db, "diaryEntries"), {
          originalEntry: entry,
          timestamp: serverTimestamp()
      });

      // The result from the server action will match our AnalysisResult type
      const result: AnalysisResult = await analyzeDiaryEntry(entry);

      // Use a type guard to check if the result is an error
      if ('error' in result) {
        setError(result.error);
        setAnalysis(null);
      } else {
        // If not an error, it must be a success, so we can safely set the analysis
        setAnalysis(result);
        setError('');
      }
    } catch (e: any) {
      console.error("An unexpected error occurred during analysis:", e);
      setError("A critical error occurred. Please check the logs or try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 text-[#1a1a1a] p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">My English Diary</h1>
          <p className="text-md sm:text-lg text-gray-600 mt-2">Write about your day. Our AI will provide feedback to make your English more natural.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Diary Input Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Entry</h2>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a4bff] focus:border-transparent transition-shadow resize-none"
              placeholder="What did you do today? What are you thinking about?"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
            />
            <button
              className="w-full mt-4 bg-[#6a4bff] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:scale-100"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze My Writing'}
            </button>
          </div>

          {/* Analysis Output Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Feedback</h2>
            <div className="flex-grow flex justify-center items-center">
              {isLoading && (
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6a4bff]"></div>
              )}
              {error && (
                  <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                      <p className="font-bold mb-2">Analysis Failed</p>
                      <p className="text-sm">{error}</p>
                  </div>
              )}
              {analysis && (
                <div className="space-y-6 w-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Fluency Score</h3>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-4 text-xs flex rounded bg-purple-200">
                        <div style={{ width: `${analysis.fluencyScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#6a4bff] to-[#8a70ff]"></div>
                      </div>
                      <p className="text-right font-bold text-[#6a4bff]">{analysis.fluencyScore}/100</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Suggested Correction</h3>
                    <p className="bg-green-100/60 p-3 rounded-lg text-green-800 italic">'{analysis.correctedText}'</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Explanation</h3>
                    <p className="text-gray-600">{analysis.explanation}</p>
                  </div>

                  <div>
                      <h3 className="text-lg font-semibold text-gray-700">Key Expressions to Learn</h3>
                      <ul className="space-y-2 mt-2">
                          {analysis.keyExpressions.map((expression, index) => (
                              <li key={index} className="bg-gray-100 p-3 rounded-lg">
                                  <p className="font-bold text-gray-800">{expression}</p>
                              </li>
                          ))}
                      </ul>
                  </div>
                </div>
              )}
              {!isLoading && !analysis && !error && (
                <div className="text-center text-gray-500">
                  <p>Your analysis will appear here once you submit an entry.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
