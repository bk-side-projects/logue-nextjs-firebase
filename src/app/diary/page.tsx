'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import AIAnalysisResult, { AIAnalysisResponse } from '../../components/AIAnalysisResult'; 
import { analyzeDiaryEntry } from '../actions'; 

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const AnalyzingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="w-24 h-24 border-8 border-dashed rounded-full animate-spin border-white"></div>
        <p className="text-white text-2xl mt-6 font-semibold">Our AI is analyzing your entry...</p>
    </div>
);

export default function DiaryPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [diaryContent, setDiaryContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<(AIAnalysisResponse & { id: string }) | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#6a4bff]"></div>
        </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleAnalysis = async () => {
    if (!diaryContent.trim() || !user) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    const formData = new FormData();
    formData.append('diaryContent', diaryContent);
    formData.append('uid', user.uid); // Pass the user's UID

    const result = await analyzeDiaryEntry(null, formData);

    if ('error' in result) {
      setAnalysisError(result.error);
    } else {
      setAnalysisResult(result);
    }

    setIsAnalyzing(false);
  };

  const handleReset = () => {
      setDiaryContent('');
      setAnalysisResult(null);
      setAnalysisError(null);
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {isAnalyzing && <AnalyzingSpinner />} 
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-md">
         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
           <h1 className="text-2xl font-bold text-gray-800 tracking-wider cursor-pointer" onClick={() => router.push('/')}>Logue</h1>
           <div className="flex items-center space-x-4">
             <span className="text-gray-700">Hello, {user.displayName}!</span>
             <Image
              src={user.photoURL || ''}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300 shadow-sm"
            />
            <button
              onClick={logout}
              className="font-semibold text-gray-600 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl mt-8">
            {!analysisResult && (
                <>
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">What's on your mind?</h2>
                    <p className="text-gray-500 mb-8">Write in English. Your AI tutor will help you refine it.</p>
          
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                        <QuillEditor
                        value={diaryContent}
                        onChange={setDiaryContent}
                        modules={quillModules}
                        theme="snow"
                        placeholder="I went to a cafe today and..."
                        className="bg-white"
                        />
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                        onClick={handleAnalysis}
                        disabled={!diaryContent.trim() || isAnalyzing}
                        className="bg-[#6a4bff] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#5238cc] transition-all transform hover:scale-105 shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        >
                        {isAnalyzing ? 'Analyzing...' : 'Submit & Analyze'}
                        </button>
                    </div>
                </>
            )}

          {analysisError && <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center mt-4">{analysisError}</p>}

          {analysisResult && user && <AIAnalysisResult result={analysisResult} onReset={handleReset} uid={user.uid} />} 
        </div>
      </main>
    </div>
  );
}
