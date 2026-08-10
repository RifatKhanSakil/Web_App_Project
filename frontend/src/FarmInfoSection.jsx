import React from 'react';

const FarmInfoSection = () => {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Facility Info Card */}
          <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200/60">
            <div className="p-3 bg-[#1B3B2B] text-white rounded-lg shrink-0">
              {/* Home/Farm Building SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">About Our Farm & Facilities</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dedicated to ethical animal husbandry, transparent health records, and premium livestock care.
              </p>
            </div>
          </div>

          {/* Organic Feeding Card */}
          <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200/60">
            <div className="p-3 bg-[#1B3B2B] text-white rounded-lg shrink-0">
              {/* Organic/Leaf SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">100% Organic Feeding</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our livestock are fed high-quality green grass, silage, and balanced natural grain feed with no artificial hormones.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FarmInfoSection;