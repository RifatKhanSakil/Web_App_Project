import React, { useEffect, useState } from 'react';
import { getContactMessages, deleteContactMessage, getCurrentUser } from './api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      getContactMessages()
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Failed to load messages:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Restrict non-admin users
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-stone-600 mt-2">You do not have administrative privileges to view this page.</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id && msg._id !== id));
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Inbox</h1>
          <p className="text-stone-600 mt-1">Manage user queries and contact submissions.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-xl font-semibold text-sm">
          Total Messages: {messages.length}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 italic bg-white p-6 rounded-xl border">No messages received yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => {
            const msgId = msg.id || msg._id;
            return (
              <div key={msgId} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-[#1B3B2B]">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium hover:underline">
                      {msg.email}
                    </a>
                  </div>
                  <p className="text-stone-700 text-sm whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-100">
                    {msg.message}
                  </p>
                  <span className="text-xs text-stone-400 block">
                    Received: {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(msgId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}