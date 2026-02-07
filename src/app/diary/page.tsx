'use client';

import { useState, useMemo } from 'react';

export default function DiaryPage() {
  const [entry, setEntry] = useState('');

  const containsKorean = (text: string) => /[\u3131-\uD79D]/.test(text);

  const isInvalid = useMemo(() => containsKorean(entry), [entry]);

  const handleSave = () => {
    if (isInvalid) {
      alert('Please write in English only.');
      return;
    }
    // Save logic here
    alert('Diary saved!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCF6] font-serif p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl flex flex-col" style={{border: '1px solid #EAEAEA'}}>
        {/* Paper-like header */}
        <div className="p-6 border-b-2 border-dashed border-gray-300">
            <h1 className="text-4xl text-gray-800 font-bold text-center tracking-wider">My Diary</h1>
            <p className="text-center text-gray-500 mt-2"> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} </p>
        </div>

        {/* Text area for the diary entry */}
        <div className="p-6 flex-grow">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full h-full text-lg text-gray-700 bg-transparent focus:outline-none resize-none leading-loose tracking-wide"
            placeholder="Start writing your thoughts in English..."
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Action buttons at the bottom */}
        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end items-center border-t border-gray-200">
          {isInvalid && <p className="text-red-500 mr-4">English only</p>}
          <button
            onClick={handleSave}
            disabled={isInvalid}
            className={`px-8 py-3 text-white font-bold rounded-lg transition-colors ${isInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6a4bff] hover:bg-[#5238cc]'}`}>
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
