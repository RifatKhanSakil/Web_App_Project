import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from './api';

export default function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();
  const currentUser = user || getCurrentUser();

  const onLogout = () => {
    if (handleLogout) {
      handleLogout();
    } else {
      signOut();
    }
    navigate('/');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav className="bg-[#1B3B2B] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="text-xl font-serif font-bold tracking-tight text-amber-100 hover:text-white transition cursor-pointer"
        >
          KHAN AGRO
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-3 text-xs font-semibold">
          <Link
            to="/"
            className="px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            to="/cattle"
            className="px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition"
          >
            Cows & Bulls
          </Link>
          <Link
            to="/goats"
            className="px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition"
          >
            Goats & Bucks
          </Link>
          
          {/* Admin vs User View for Eid Booking */}
          <Link
            to="/eid-booking"
            className="px-3 py-2 rounded-lg text-amber-200 hover:bg-white/10 hover:text-amber-100 transition"
          >
            {isAdmin ? 'See Eid Booking' : 'Eid Booking'}
          </Link>

          <Link
            to="/about"
            className="px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition"
          >
            About Us
          </Link>

          {/* Admin vs User View for Contact Us */}
          <Link
            to="/contact"
            className="px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 hover:text-white transition"
          >
            {isAdmin ? 'See Messages' : 'Contact Us'}
          </Link>

          {/* ADMIN-ONLY NAVIGATION ITEM */}
          {isAdmin && (
            <Link
              to="/add-animal"
              className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-sm"
            >
              + Add Animal
            </Link>
          )}
        </div>

        {/* Auth Navigation Actions */}
        <div className="flex items-center gap-3 border-l border-emerald-700/85 pl-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs text-amber-100 font-medium">
                  Hi, {currentUser.full_name || currentUser.name || currentUser.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-[#1B3B2B] text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}