'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import Image from 'next/image';
import AIAnalysisResult, { AIAnalysisResponse } from '../../components/AIAnalysisResult'; 
import { analyzeDiaryEntry } from '../actions';

const LocalSpinner = () => (
    <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#6a4bff]"></div>
        <p className="text-gray-600 text-lg mt-4">AI가 당신의 하루를 분석하고 있어요...</p>
    </div>
);

export default function DiaryPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [diaryContent, setDiaryContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<(AIAnalysisResponse & { id: string }) | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (analysisResult || analysisError) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysisResult, analysisError]);

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
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('diaryContent', diaryContent);
    formData.append('uid', user.uid);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-md">
         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
           <h1 className="text-2xl font-bold text-gray-800 tracking-wider cursor-pointer" onClick={() => router.push('/')}>Logue</h1>
           <div className="flex items-center space-x-4">
             <span className="text-gray-700">안녕하세요, {user.displayName}님!</span>
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
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl mt-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">오늘 어떤 하루를 보내셨나요?</h2>
            <p className="text-gray-500 mb-8 text-center">당신의 이야기를 영어로 기록해보세요. AI가 더 나은 표현을 제안해 줄 거예요.</p>
  
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                 <textarea
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder="I went to a cafe today and..."
                    className="w-full h-64 p-6 text-lg border-none focus:ring-0 resize-none bg-white rounded-xl"
                    disabled={isAnalyzing}
                />
            </div>
            <div className="flex justify-center mt-6">
                <button
                onClick={handleAnalysis}
                disabled={!diaryContent.trim() || isAnalyzing}
                className="bg-gradient-to-r from-[#6a4bff] to-[#a259ff] text-white px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform transform shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                {isAnalyzing ? '분석 중...' : '내 하루 분석하기'}
                </button>
            </div>
        </div>

        <div ref={resultsRef} className="w-full max-w-3xl mt-12">
            {isAnalyzing && <LocalSpinner />}
            {analysisError && <p className="text-red-500 bg-red-100 p-6 rounded-xl text-center font-semibold text-lg">오류: {analysisError}</p>}
            {analysisResult && user && <AIAnalysisResult result={analysisResult} onReset={handleReset} uid={user.uid} />}
        </div>
      </main>
    </div>
  );
}
