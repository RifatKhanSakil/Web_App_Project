import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAnimalWithImage, getCurrentUser } from './api';

const AddAnimalPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-700">Access Denied</h2>
        <p className="text-gray-600 mt-2">You must be logged in as an admin to access this page.</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    category: 'cow',
    breed: '',
    weight: '',
    price: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('breed', formData.breed);
      data.append('weight', formData.weight);
      data.append('price', formData.price);
      data.append('description', formData.description || '');
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await uploadAnimalWithImage(data);
      
      // Redirect based on category chosen
      if (formData.category === 'cow') {
        navigate('/cattle');
      } else {
        navigate('/goats');
      }
    } catch (err) {
      console.error("Failed to add animal:", err);
      setError(err.message || "Failed to add animal listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Add New Animal</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to list a new cow, bull, or goat for sale.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Animal Title / Name</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Premium Shahiwal Bull"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
            >
              <option value="cow">Cow / Bull</option>
              <option value="goat">Goat / Buck</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
            <input
              type="text"
              name="breed"
              required
              value={formData.breed}
              onChange={handleChange}
              placeholder="e.g., Shahiwal, Deshi, Boer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              required
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 350"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (৳)</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 150000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Animal Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-[#1B3B2B] hover:file:bg-emerald-100 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description / Notes</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide teeth count, health details, feeding habits, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3B2B] focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1B3B2B] hover:bg-opacity-90 text-white font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Uploading Listing...' : 'Publish Animal Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddAnimalPage;