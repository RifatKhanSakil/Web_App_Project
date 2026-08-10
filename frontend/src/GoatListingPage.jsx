import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnimals, deleteAnimal, getCurrentUser } from './api';

const GoatListingPage = () => {
  const [goatList, setGoatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve current logged in user for role checking
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Pass the category parameter to filter backend side for goats
    getAnimals("goat")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setGoatList(list);
      })
      .catch((err) => {
        console.error("Failed to load goat listings:", err);
        setError("Unable to connect to server. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Admin Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteAnimal(id);
      // Remove deleted goat from local UI state instantly
      setGoatList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete listing");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Goats & Bucks Collection</h1>
        <p className="text-gray-600 mt-2">Explore healthy and active Deshi, Boer cross, and Totapuri goats.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border p-4 rounded-xl animate-pulse space-y-3">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : goatList.length === 0 ? (
        <p className="text-gray-500 italic">No goats available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goatList.map((animal) => (
            <div key={animal.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
              <img 
                src={animal.image_url || animal.image || 'https://via.placeholder.com/400x300?text=Goat'} 
                alt={animal.title || animal.name} 
                className="w-full h-48 object-contain bg-stone-50"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{animal.title || animal.name || animal.tag_number || "Goat"}</h2>
                  <p className="text-sm text-gray-600 mt-1">Weight: {animal.weight ? `${animal.weight} kg` : 'N/A'}</p>
                  <p className="text-sm font-semibold text-[#1B3B2B] mt-1">
                    Price: ৳{animal.price ? animal.price.toLocaleString() : 'Contact for Price'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/animal/${animal.id}`}
                    className="block text-center py-2 px-4 bg-[#1B3B2B] text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition"
                  >
                    View Details
                  </Link>

                  {/* ADMIN-ONLY DELETE BUTTON */}
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(animal.id)}
                      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
                    >
                      Delete Animal (Admin)
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoatListingPage;