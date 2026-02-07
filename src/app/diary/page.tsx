'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { analyzeDiaryEntry } from './actions'; // Import the server action

// A simple icon component for the back arrow
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function DiaryPage() {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const containsNonEnglish = (text: string) => !/^[a-zA-Z0-9.,!?'"\s\n]*$/.test(text);

  const isInvalid = useMemo(() => entry.trim() === '' || containsNonEnglish(entry), [entry]);

  const handleComplete = async () => {
    if (isInvalid) {
      alert('Please write something in English only.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    const result = await analyzeDiaryEntry(entry);

    if (result.error) {
      setError(result.error);
    } else {
      setAnalysisResult(result);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 font-serif">
        <header className="w-full max-w-4xl mx-auto py-4 px-2 flex justify-between items-center">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <BackArrowIcon />
                <span className="ml-2 font-sans font-semibold">Back to Home</span>
            </Link>
        </header>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col mb-8" style={{border: '1px solid #EAEAEA'}}>
            <div className="p-6 border-b-2 border-dashed border-gray-200">
                <p className="text-center text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h1 className="text-3xl text-gray-800 font-bold text-center tracking-wider mt-2">What's on your mind?</h1>
            </div>

            <div className="p-6 flex-grow bg-[repeating-linear-gradient(white,white_29px,#dce1e6_30px,#dce1e6_31px)]">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full h-full text-lg text-gray-800 bg-transparent focus:outline-none resize-none leading-8 tracking-wide"
                placeholder="Start writing..."
                rows={15}
              />
            </div>

            <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end items-center border-t border-gray-200">
              {isInvalid && entry.length > 0 && <p className="text-red-500 mr-4 font-sans">English only, please.</p>}
              <button
                onClick={handleComplete}
                disabled={isInvalid || isAnalyzing}
                className={`px-8 py-3 text-white font-sans font-bold rounded-lg transition-all duration-300 ${isInvalid || isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} ${isAnalyzing ? 'animate-pulse' : ''}`}>
                {isAnalyzing ? 'Analyzing...' : 'Complete & Analyze'}
              </button>
            </div>
        </div>
        
        {/* Error Message */}
        {error && (
            <div className="w-full max-w-4xl my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold font-sans">Error: </strong>
                <span className="block sm:inline font-sans">{error}</span>
            </div>
        )}

        {/* Analysis Result Section */}
        {analysisResult && (
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 border border-gray-200 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-sans flex items-center">AI Feedback ✨</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Correction and Explanation */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-sans font-semibold text-purple-700">Suggested Improvement:</h3>
                            <p className="text-lg text-gray-800 leading-relaxed p-4 bg-purple-50 rounded-md mt-2">{analysisResult.correctedText}</p>
                        </div>
                        <div>
                            <h3 className="font-sans font-semibold text-blue-700">Explanation:</h3>
                            <p className="text-gray-700 leading-relaxed p-4 bg-blue-50 rounded-md mt-2">{analysisResult.explanation}</p>
                        </div>
                    </div>
                    {/* Right Column: Score and Key Expressions */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-sans font-semibold text-green-700">Fluency Score:</h3>
                            <div className="p-4 bg-green-50 rounded-md mt-2 flex items-center justify-center">
                                <p className="text-6xl font-bold text-green-600">{analysisResult.fluencyScore}<span className="text-3xl">/100</span></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-sans font-semibold text-yellow-700">Key Expressions to Remember:</h3>
                            <ul className="list-disc list-inside p-4 bg-yellow-50 rounded-md mt-2 space-y-2">
                                {analysisResult.keyExpressions?.map((exp: string, index: number) => (
                                    <li key={index} className="text-gray-700 font-semibold">{exp}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
