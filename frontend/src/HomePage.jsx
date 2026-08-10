import React from 'react';
import { useNavigate } from 'react-router-dom';
import FarmInfoSection from './FarmInfoSection';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FBF8F3] text-[#1B3B2B]">
      
      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold px-3.5 py-1.5 bg-emerald-100 text-[#1B3B2B] rounded-full uppercase tracking-wider mb-4 inline-block">
            Ethically Raised Livestock
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1B3B2B] leading-tight mt-2">
            Premium Ethically Raised Livestock
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-6 mb-8 max-w-2xl mx-auto">
            Welcome to KHAN AGRO. Explore organic Deshi, Brahma, and Shahiwal cattle, along with healthy Beetal and Barbari goats for dairy, farming, and Qurbani requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/cattle')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
            >
              Browse Cow Collection &rarr;
            </button>
            <button
              onClick={() => navigate('/goats')}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-200 hover:bg-stone-300 text-[#1B3B2B] text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Browse Goat Collection &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Farm Information Component Section */}
      <section className="border-t border-stone-200/60 bg-white py-12">
        <FarmInfoSection />
      </section>

    </div>
  );
}