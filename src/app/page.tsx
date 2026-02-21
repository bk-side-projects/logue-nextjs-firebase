'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/AuthContext'; // Import useAuth

export default function LandingPage() {
  const { user, signInWithGoogle, logout } = useAuth(); // Get auth state and functions

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider text-gray-800">Logue</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#6a4bff] transition-colors">Features</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/diary">
                  <button className="bg-[#6a4bff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-lg">
                    Start Writing
                  </button>
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-gray-900 font-semibold">
                  Logout
                </button>
                <Image
                  src={user.photoURL || ''} // Handle case where photoURL is null
                  alt={user.displayName || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200"
                />
              </>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="bg-[#6a4bff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-lg">
                Login with Google
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 pt-32 pb-16 text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-gray-900">
          Write Your Day,
          <br />
          <span className="text-[#6a4bff]">Master the Language.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10">
          Logue is your personal AI English diary that refines your thoughts, turning everyday entries into tangible English skill.
        </p>

        {/* App Preview Graphic */}
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-4 border border-gray-200 mb-10">
            <div className="w-full h-8 bg-gray-100 rounded-t-lg flex items-center px-3">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="p-6 text-left">
                <p className="text-gray-400">// Write about your day...</p>
                <p className="text-gray-800 my-2">I had a really <span className="bg-yellow-200/50">productive</span> day. I finished the quarterly report and gave a presentation that my team seemed to like.</p>
                <p className="text-gray-400 my-2">// AI suggests a more natural expression...</p>
                <p className="text-green-600 font-medium">I feel like I had a really <span className="bg-green-200/50 font-semibold">fruitful</span> day. I wrapped up the quarterly report and delivered a presentation that seemed to <span className="bg-green-200/50 font-semibold">resonate with</span> my team.</p>
            </div>
        </div>

        <Link href="/diary">
            <button className="bg-[#6a4bff] text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-xl">
                Start Your Journey
            </button>
        </Link>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Your Daily Path to Fluency</h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Logue isn't just a diary. It's a structured learning experience designed for growth.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
              <h3 className="text-2xl font-bold mb-3 text-[#6a4bff]">3. Build Your Language Assets</h3>
              <p className="text-gray-600">Save corrected sentences and key expressions. Turn your daily records into a personal library of what you've learned. (Growth)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Logue. Your journey to fluency starts here.</p>
        </div>
      </footer>
    </div>
  );
}
