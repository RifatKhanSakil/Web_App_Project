import React, { useState, useEffect } from "react";
import { getLivestock } from "./api"; // adjust path to match your api.js

export default function CattleListingPage({ onSelectAnimal }) {
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchCattle() {
      try {
        setLoading(true);
        // Fetch all livestock and filter for cattle
        const data = await getLivestock();
        const cattleList = Array.isArray(data)
          ? data.filter((item) => item.category?.toLowerCase() === "cattle" || item.type?.toLowerCase() === "cattle" || item.species?.toLowerCase() === "cattle")
          : [];
        setCattle(cattleList);
      } catch (error) {
        console.error("Failed to fetch cattle data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCattle();
  }, []);

  const filteredCattle = cattle.filter((item) => {
    const matchesSearch =
      item.tag_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="listing-page-container">
      <div className="listing-header">
        <h1>Cattle Collection</h1>
        <p>Explore our premium bulls, cows, and calves with verified weight and health logs.</p>
      </div>

      {/* Search and Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by Tag ID or Breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="loading-spinner">Loading cattle records...</div>
      ) : filteredCattle.length === 0 ? (
        <div className="no-results">No cattle found matching your criteria.</div>
      ) : (
        <div className="livestock-grid">
          {filteredCattle.map((item) => (
            <div key={item._id || item.tag_id} className="livestock-card">
              <div className="card-image-wrapper">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80"}
                  alt={item.title || `Cattle ${item.tag_id}`}
                  className="card-img"
                />
                <span className={`status-badge status-${item.status?.toLowerCase() || "available"}`}>
                  {item.status || "Available"}
                </span>
              </div>
              <div className="card-body">
                <h3>{item.title || `Tag: ${item.tag_id}`}</h3>
                <p className="breed-info"><strong>Breed:</strong> {item.breed || "Standard"}</p>
                <div className="card-details">
                  <span><strong>Weight:</strong> {item.weight ? `${item.weight} kg` : "N/A"}</span>
                  <span><strong>Price:</strong> {item.price ? `$${item.price}` : "Contact for Price"}</span>
                </div>
                <button
                  className="btn btn-outline"
                  onClick={() => onSelectAnimal && onSelectAnimal(item._id || item.tag_id)}
                >
                  View Details &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}