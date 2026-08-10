import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimalById } from './api';

export default function AnimalDetailsPage({ onBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getAnimalById(id)
      .then((data) => {
        setAnimal(data);
      })
      .catch((err) => {
        console.error("Failed to fetch animal details:", err);
        setError("Animal not found or unable to load details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 animate-pulse">Loading animal details...</p>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-red-600 mb-4">{error || "Animal not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#1B3B2B] text-white rounded-lg text-sm font-semibold"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-[#1B3B2B] hover:underline mb-6 inline-flex items-center gap-1 cursor-pointer"
      >
        &larr; Back to Listings
      </button>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Dynamic Animal Image */}
          <img
            src={animal.image_url || animal.image || 'https://via.placeholder.com/600x400?text=Animal'}
            alt={animal.title || animal.name}
            className="w-full h-72 md:h-96 object-cover object-center rounded-2xl shadow-sm"
          />

          <div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase">
              {animal.category || 'Livestock'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3B2B] mt-3">
              {animal.title || animal.name || "Animal Details"}
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
              {animal.description || "Vaccinated, grass-fed, and raised on an organic farm. Complete health certificate provided upon booking."}
            </p>

            <div className="mt-6 space-y-2 border-t border-b border-stone-100 py-4 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="text-stone-500">Breed:</span>
                <span className="font-semibold">{animal.breed || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Weight:</span>
                <span className="font-semibold">{animal.weight ? `${animal.weight} kg` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Price:</span>
                <span className="font-semibold text-[#1B3B2B]">
                  ৳{animal.price ? animal.price.toLocaleString() : 'Contact for Price'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Health Status:</span>
                <span className="font-semibold text-emerald-600">Fully Vaccinated</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onBook) {
                  onBook(animal.id);
                } else {
                  navigate('/eid-booking');
                }
              }}
              className="w-full mt-6 py-3.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Book / Inquiry Now &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}