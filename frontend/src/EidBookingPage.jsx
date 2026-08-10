import React, { useState, useEffect } from 'react';
import { getCurrentUser, getEidBooking, createEidBooking, getAuthHeaders } from './api';

const BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = `${BASE_URL}/api`;

const BOOKING_START_DATE = new Date('2026-08-10T00:00:00');
const BOOKING_END_DATE = new Date('2026-08-31T23:59:59');

export default function EidBookingPage() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Admin state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // User form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    animalType: 'Cow',
    preferredDate: '',
    notes: '',
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDate = new Date();
  const isBookingOpen = currentDate >= BOOKING_START_DATE && currentDate <= BOOKING_END_DATE;

  // Fetch bookings if admin
  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [isAdmin]);

  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await getEidBooking();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id && b.id !== id));
        if (selectedBooking?._id === id || selectedBooking?.id === id) {
          setSelectedBooking(null);
        }
      } else {
        alert('Failed to delete booking.');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isBookingOpen) {
      setStatusMessage({
        type: 'error',
        text: 'Booking is currently closed. Bookings are only accepted during the designated booking period.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await createEidBooking(formData);
      setStatusMessage({
        type: 'success',
        text: 'Booking details submitted!',
      });
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        animalType: 'Cow',
        preferredDate: '',
        notes: '',
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error.message || 'Failed to save booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= ADMIN VIEW =================
  if (isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1B3B2B]">Manage Eid Bookings</h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">Review, inspect details, or remove customer livestock reservations.</p>
          </div>
          <button 
            onClick={loadBookings} 
            className="px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-xl hover:bg-[#142d21] transition cursor-pointer"
          >
            Refresh List
          </button>
        </div>

        {loadingBookings ? (
          <p className="text-center py-12 text-stone-500 text-sm">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm shadow-sm">
            No Eid bookings found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {bookings.map((b) => (
                <div 
                  key={b._id || b.id} 
                  onClick={() => setSelectedBooking(b)}
                  className={`p-4 cursor-pointer transition hover:bg-emerald-50/50 ${selectedBooking?._id === b._id || selectedBooking?.id === b.id ? 'bg-emerald-50 border-l-4 border-[#1B3B2B]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-stone-800 text-sm">{b.fullName}</h3>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase font-semibold">
                      {b.animalType}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">{b.phone}</p>
                </div>
              ))}
            </div>

            {/* Detail View Pane */}
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              {selectedBooking ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1B3B2B]">{selectedBooking.fullName}</h2>
                      <p className="text-xs text-stone-400">Booking ID: {selectedBooking._id || selectedBooking.id}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(selectedBooking._id || selectedBooking.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Delete Booking
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block font-semibold text-stone-400 uppercase">Phone</span>
                      <span className="text-stone-800 font-medium mt-0.5 block">{selectedBooking.phone}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block font-semibold text-stone-400 uppercase">Email</span>
                      <span className="text-stone-800 font-medium mt-0.5 block">{selectedBooking.email || 'N/A'}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block font-semibold text-stone-400 uppercase">Animal Type</span>
                      <span className="text-stone-800 font-medium mt-0.5 block uppercase">{selectedBooking.animalType}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-xl">
                      <span className="block font-semibold text-stone-400 uppercase">Preferred Delivery Date</span>
                      <span className="text-stone-800 font-medium mt-0.5 block">{selectedBooking.preferredDate ? new Date(selectedBooking.preferredDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl text-xs">
                    <span className="block font-semibold text-stone-400 uppercase mb-1">Delivery Address</span>
                    <p className="text-stone-800 leading-relaxed">{selectedBooking.address}</p>
                  </div>

                  {selectedBooking.notes && (
                    <div className="bg-stone-50 p-3 rounded-xl text-xs">
                      <span className="block font-semibold text-stone-400 uppercase mb-1">Notes / Requests</span>
                      <p className="text-stone-800 leading-relaxed">{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-20 text-stone-400 text-xs">
                  Select a booking from the left list to view complete details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= PUBLIC USER VIEW =================
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        <div className="text-center mb-8">
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-900 rounded-full uppercase tracking-wider">
            Qurbani Special
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1B3B2B] mt-3">
            Advance Eid Animal Booking
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            Allowed Booking Period: {BOOKING_START_DATE.toLocaleDateString()} to {BOOKING_END_DATE.toLocaleDateString()}
          </p>
        </div>

        {!isBookingOpen ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mb-6">
            <p className="text-amber-800 text-sm font-semibold">
              ⚠️ Booking is Currently Closed
            </p>
            <p className="text-amber-700 text-xs mt-1">
              Advance bookings are only accepted between{' '}
              <span className="font-bold">{BOOKING_START_DATE.toDateString()}</span> and{' '}
              <span className="font-bold">{BOOKING_END_DATE.toDateString()}</span>.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center mb-6">
            <p className="text-emerald-800 text-xs font-semibold">
              ✅ Booking Period Active — Secure your livestock selection below.
            </p>
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs mb-6 font-medium ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              disabled={!isBookingOpen}
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                disabled={!isBookingOpen}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={!isBookingOpen}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Full Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              rows="3"
              required
              disabled={!isBookingOpen}
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Street details, Thana, District"
              className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Animal Type
              </label>
              <select
                name="animalType"
                disabled={!isBookingOpen}
                value={formData.animalType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
              >
                <option value="Cow">Cow</option>
                <option value="Goat">Goat</option>
                <option value="Multiple Livestock">Multiple Livestock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                name="preferredDate"
                disabled={!isBookingOpen}
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FBF8F3] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isBookingOpen || isSubmitting}
            className="w-full mt-4 py-3 bg-[#1B3B2B] hover:bg-[#142d21] text-white text-xs font-semibold rounded-xl transition disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Saving to Database...' : 'Confirm & Submit Booking'} &rarr;
          </button>
        </form>

      </div>
    </div>
  );
}