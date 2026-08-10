import React, { useState, useEffect } from 'react';
import { submitContactMessage, getCurrentUser, getAuthHeaders } from './api';

const BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = `${BASE_URL}/api`;

export default function ContactPage() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Admin state for messages
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // User form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/messages`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch contact messages status:', res.status);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact/messages/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id && m.id !== id));
        if (selectedMessage?._id === id || selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Failed to delete message.');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactMessage(formData);
      window.alert("Message Sent Successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= ADMIN VIEW =================
  if (isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">See Messages</h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">Review inquiries sent by users through the contact form.</p>
          </div>
          <button 
            onClick={fetchMessages} 
            className="px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-xl hover:bg-[#142d21] transition cursor-pointer"
          >
            Refresh Messages
          </button>
        </div>

        {loadingMessages ? (
          <p className="text-center py-12 text-stone-500 text-sm">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-sm shadow-sm">
            No contact messages found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {messages.map((m) => (
                <div 
                  key={m._id || m.id} 
                  onClick={() => setSelectedMessage(m)}
                  className={`p-4 cursor-pointer transition hover:bg-emerald-50/50 ${selectedMessage?._id === m._id || selectedMessage?.id === m.id ? 'bg-emerald-50 border-l-4 border-[#1B3B2B]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-stone-800 text-sm">{m.name}</h3>
                    <span className="text-[10px] text-stone-400">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-1">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Detail View Pane */}
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1B3B2B]">{selectedMessage.name}</h2>
                      <p className="text-xs text-stone-400">Email: {selectedMessage.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage._id || selectedMessage.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Delete Message
                    </button>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl text-xs space-y-2">
                    <span className="block font-semibold text-stone-400 uppercase">Message Content</span>
                    <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-20 text-stone-400 text-xs">
                  Select a message from the list to view its contents.
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-2">Have a question about our farm or livestock? Send us a message.</p>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Your Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Message *</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B3B2B]"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#1B3B2B] hover:bg-[#142d21] text-white font-semibold rounded-xl transition cursor-pointer"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}