'use client';

import { useState } from 'react';
import { FiThumbsUp, FiArrowRight, FiPlusSquare, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { saveToVault } from '../app/actions'; // Import the server action

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

interface AIAnalysisResultProps {
  result: AIAnalysisResponse & { id: string };
  onReset: () => void;
  uid: string; // User ID is needed to save to vault
}

const AIAnalysisResult = ({ result, onReset, uid }: AIAnalysisResultProps) => {
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const handleSaveToVault = async (text: string) => {
    const response = await saveToVault(uid, text);
    if (response.success) {
      setSavedItems([...savedItems, text]);
      // Optionally, show a toast notification here
    } else {
      // Optionally, show an error notification
      alert(response.error);
    }
  };

  return (
    <div className="mt-12 w-full max-w-3xl animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800">AI Analysis & Suggestions</h3>
        <button 
            onClick={onReset}
            className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-purple-700 transition-colors"
        >
            <FiRefreshCw />
            <span>Write a new entry</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 mb-8 flex items-center space-x-8">
        <div style={{ width: 120, height: 120 }}>
          <CircularProgressbar 
              value={result.overallScore}
              text={`${result.overallScore}%`}
              styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: 'round',
                  textSize: '20px',
                  pathTransitionDuration: 0.5,
                  pathColor: `rgba(106, 75, 255, ${result.overallScore / 100})`,
                  textColor: '#333',
                  trailColor: '#d6d6d6',
              })}
          />
        </div>
        <div>
          <h4 className="font-bold text-xl text-gray-800 mb-2">Tutor's Summary</h4>
          <p className="text-gray-700">{result.summary}</p>
        </div>
      </div>

      <div className="space-y-8">
        {result.feedback.map((feedback, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-transform hover:scale-105">
            {feedback.isPerfect ? (
              <div className="flex items-center space-x-4">
                <FiThumbsUp className="text-green-500 text-3xl flex-shrink-0" />
                <div>
                    <p className="text-gray-500 italic mb-1">Original: "{feedback.original}"</p>
                    <p className="text-gray-700 font-medium">
                        <span className="font-bold text-green-600">Perfect!</span> {feedback.explanation}
                    </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <p className="md:col-span-5 text-gray-600 line-through decoration-red-400 decoration-2 italic">{feedback.original}</p>
                  <div className="col-span-1 flex justify-center">
                    <FiArrowRight className="text-purple-500 text-2xl transform rotate-90 md:rotate-0"/>
                  </div>
                  <p className="md:col-span-6 font-semibold text-green-700 text-lg">{feedback.suggestion}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Tutor's Note:</h4>
                  <p 
                    className="text-gray-600 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: feedback.explanation }}
                  ></p>
                </div>

                <div className="flex justify-end mt-4">
                    {savedItems.includes(feedback.suggestion) ? (
                        <span className="flex items-center space-x-2 text-sm font-semibold text-green-500">
                            <FiCheckCircle />
                            <span>Saved!</span>
                        </span>
                    ) : (
                        <button 
                            onClick={() => handleSaveToVault(feedback.suggestion)}
                            className="flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            <FiPlusSquare />
                            <span>Save to Vault</span>
                        </button>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAnalysisResult;
