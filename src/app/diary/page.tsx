'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// A simple icon component for the back arrow
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function DiaryPage() {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null); // Will hold the AI feedback

  // Regular expression to detect any non-English characters (including Korean)
  // This is a more robust check.
  const containsNonEnglish = (text: string) => !/^[a-zA-Z0-9.,!?'"\s]*$/.test(text);

  const isInvalid = useMemo(() => entry.trim() === '' || containsNonEnglish(entry), [entry]);

  const handleComplete = async () => {
    if (isInvalid) {
      alert('Please write something in English only.');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // --- FAKE AI ANALYSIS (to be replaced with Gemini) ---
    await new Promise(resolve => setTimeout(resolve, 2000));
    const fakeResult = {
        correctedText: "I feel I had a truly fruitful day. I wrapped up the quarterly report and delivered a presentation that seemed to resonate with my team.",
        explanation: "\'Productive\' is good, but \'fruitful\' suggests the work will have positive long-term results. \'Resonate with\' is a more natural way to say people connected with your idea.",
        fluencyScore: 92,
    };
    setAnalysisResult(fakeResult as any);
    // -----------------------------------------------------

    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-serif">
        {/* Header with Back Button */}
        <header className="w-full max-w-4xl mx-auto py-4 px-2 flex justify-between items-center">
            <Link href="/" className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <BackArrowIcon />
                <span className="ml-2 font-sans font-semibold">Back to Home</span>
            </Link>
        </header>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col" style={{border: '1px solid #EAEAEA'}}>
            {/* Paper-like header */}
            <div className="p-6 border-b-2 border-dashed border-gray-200">
                <p className="text-center text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h1 className="text-3xl text-gray-800 font-bold text-center tracking-wider mt-2">What's on your mind?</h1>
            </div>

            {/* Lined paper text area */}
            <div className="p-6 flex-grow bg-[repeating-linear-gradient(white,white_29px,#dce1e6_30px,#dce1e6_31px)]">
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full h-full text-lg text-gray-800 bg-transparent focus:outline-none resize-none leading-8 tracking-wide"
                placeholder="Start writing..."
                rows={15}
              />
            </div>

            {/* Action buttons */}
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
        
        {/* Analysis Result Section */}
        {analysisResult && (
            <div className="w-full max-w-4xl mt-8 bg-white rounded-lg shadow-2xl p-8 border border-gray-200 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">AI Feedback</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-sans font-semibold text-purple-700">Suggested Improvement:</h3>
                        <p className="text-lg text-gray-800 leading-relaxed p-4 bg-purple-50 rounded-md mt-2">{(analysisResult as any).correctedText}</p>
                    </div>
                    <div>
                        <h3 className="font-sans font-semibold text-blue-700">Explanation:</h3>
                        <p className="text-gray-700 leading-relaxed p-4 bg-blue-50 rounded-md mt-2">{(analysisResult as any).explanation}</p>
                    </div>
                    <div>
                        <h3 className="font-sans font-semibold text-green-700">Fluency Score:</h3>
                        <p className="text-3xl font-bold text-green-600">{(analysisResult as any).fluencyScore} / 100</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
