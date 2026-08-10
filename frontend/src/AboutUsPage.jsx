import React, { useEffect, useState } from 'react';
import { getAboutUs } from './api';

const AboutUsPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAboutUs()
      .then((data) => {
        if (isMounted) setAboutData(data);
      })
      .catch((err) => {
        console.error("Failed to load about us data:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header with Established Year Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">About Khan Agro</h1>
        <span className="self-start sm:self-auto px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full uppercase tracking-wider">
          Estd. 2022
        </span>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm leading-relaxed text-gray-700 space-y-6">
        {/* Intro Paragraphs */}
        <div className="space-y-4">
          <p>
            Welcome to <strong>Khan Agro</strong>. We specialize in raising top-tier cattle and goats following strict health, nutrition, and ethical standards.
          </p>
          <p>
            Whether you are looking for healthy livestock for daily needs, breeding programs, or premium Qurbani animals for Eid, we guarantee transparent weight records and proper care for every animal in our farm.
          </p>
        </div>

        {/* Contact Information & Farm Location Box */}
        <div className="bg-[#FBF8F3] border border-stone-200/80 p-5 rounded-xl space-y-4">
          
          {/* Farm Location */}
          <div className="flex items-start gap-3">
            <div className="text-[#1B3B2B] mt-0.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3B2B]">Farm Location</h3>
              <p className="text-sm font-medium text-stone-800 mt-0.5">
                Sataish, Ward#51, Tongi(West), Gazipur City Corporation, Gazipur, Bangladesh
              </p>
            </div>
          </div>

          <div className="border-t border-stone-200/60 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact No */}
            <div className="flex items-center gap-3">
              <div className="text-[#1B3B2B] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3B2B]">Contact No</h3>
                <p className="text-sm font-medium text-stone-800 mt-0.5">01521568156</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="text-[#1B3B2B] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3B2B]">E-mail</h3>
                <a href="mailto:khanagro@gmail.com" className="text-sm font-medium text-stone-800 hover:text-[#1B3B2B] underline mt-0.5 block">
                  khanagro@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Section with Skeleton Loader */}
        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Farm Overview</h2>

          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : aboutData ? (
            <div>
              {typeof aboutData === 'string' ? (
                <p>{aboutData}</p>
              ) : (
                <div className="space-y-3 text-stone-700">
                  {aboutData.mission && <p>{aboutData.mission}</p>}
                  {aboutData.vision && <p>{aboutData.vision}</p>}
                  {aboutData.description && <p>{aboutData.description}</p>}
                  
                  {/* Fallback if it contains other general fields */}
                  {!aboutData.mission && !aboutData.vision && !aboutData.description && (
                    <p>{aboutData.title || "Dedicated to providing top-quality livestock and complete transparency."}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Farm details currently unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;