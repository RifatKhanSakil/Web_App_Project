import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import HomePage from './HomePage';
import CattleListingPage from './CattleListingPage';
import GoatListingPage from './GoatListingPage';
import AnimalDetailsPage from './AnimalDetailsPage';
import EidBookingPage from './EidBookingPage';
import AboutUsPage from './AboutUsPage';
import ContactPage from './ContactPage';
import AuthPage from './AuthPage';
import AddAnimalPage from "./AddAnimalPage";
import { getCurrentUser, signOut } from './api';


export default function App() {
  const [user, setUser] = useState(null);

  // Load user session on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-[#FBF8F3]">
        
        {/* Persistent Navbar */}
        <Navbar user={user} handleLogout={handleLogout} />

        {/* Main Route Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cattle" element={<CattleListingPageWrapper />} />
            <Route path="/goats" element={<GoatListingPageWrapper />} />
            <Route path="/animal/:id" element={<AnimalDetailsPageWrapper user={user} />} />
            <Route path="/eid-booking" element={<EidBookingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            <Route path="/add-animal" element={<AddAnimalPage />} />
            <Route path="/admin/add-animal" element={<AddAnimalPage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-stone-900 text-stone-400 py-8 text-xs text-center border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} KHAN AGRO. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

// Wrapper Functions for Page Navigation Actions
function CattleListingPageWrapper() {
  const navigate = useNavigate();
  return <CattleListingPage onSelectAnimal={(id) => navigate(`/animal/${id}`)} />;
}

function GoatListingPageWrapper() {
  const navigate = useNavigate();
  return <GoatListingPage onSelectAnimal={(id) => navigate(`/animal/${id}`)} />;
}

function AnimalDetailsPageWrapper({ user }) {
  const navigate = useNavigate();

  const handleBookAnimal = (animalId) => {
    if (!user) {
      alert('Please Sign In first to make an inquiry.');
      navigate('/auth');
      return;
    }
    navigate('/eid-booking');
  };

  return (
    <AnimalDetailsPage
      onBack={() => navigate(-1)}
      onBook={handleBookAnimal}
    />
  );
}