
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#1a1a1a]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider">Logue</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-[#6a4bff] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[#6a4bff] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#6a4bff] transition-colors">Contact</a>
          </nav>
          <Link href="/diary">
            <button className="bg-[#6a4bff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-lg">
              Start Writing
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 pt-32 pb-16 text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          Unlock Your Fluency,
          <br />
          <span className="text-[#6a4bff]">One Entry at a Time.</span>
        </h1>
        <h2>Hello, World!</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Logue is your personal AI English diary. Write your thoughts, get instant feedback, and master the nuances of native-like expression.
        </p>
        <div className="flex space-x-4">
            <Link href="/diary">
                <button className="bg-[#6a4bff] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#5238cc] transition-transform transform hover:scale-105 shadow-xl">
                    Start Your Free Trial
                </button>
            </Link>
            <a href="#features" className="bg-white text-[#1a1a1a] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl border border-gray-200">
                Learn More
            </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-2">Discover the Power of Logue</h2>
          <p className="text-gray-600 mb-12">From smart suggestions to a personalized vault, we've got you covered.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold mb-3 text-[#6a4bff]">Smart Editor</h3>
              <p className="text-gray-600">Our editor prevents non-English characters, ensuring you stay in the zone. Minimalist design for maximum focus.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold mb-3 text-[#6a4bff]">AI Coach</h3>
              <p className="text-gray-600">Get real-time feedback on grammar, style, and nuance from our advanced AI, powered by Gemini.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold mb-3 text-[#6a4bff]">Personal Vault</h3>
              <p className="text-gray-600">Save new words and expressions. Review them anytime, anywhere, and make them truly yours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Logue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
