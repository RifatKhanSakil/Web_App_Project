import React, { useState, useEffect } from "react";
import { getLivestock } from "./api"; // adjust path if needed

export default function GoatListingPage({ onSelectAnimal }) {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchGoats() {
      try {
        setLoading(true);
        const data = await getLivestock();
        const goatList = Array.isArray(data)
          ? data.filter(
              (item) =>
                item.category?.toLowerCase() === "goat" ||
                item.category?.toLowerCase() === "goats" ||
                item.type?.toLowerCase() === "goat" ||
                item.species?.toLowerCase() === "goat"
            )
          : [];
        setGoats(goatList);
      } catch (error) {
        console.error("Failed to fetch goat data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGoats();
  }, []);

  const filteredGoats = goats.filter((item) => {
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
        <h1>Goat Collection</h1>
        <p>Browse our healthy goats raised for breeding, livestock farming, and special occasions.</p>
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
        <div className="loading-spinner">Loading goat records...</div>
      ) : filteredGoats.length === 0 ? (
        <div className="no-results">No goats found matching your criteria.</div>
      ) : (
        <div className="livestock-grid">
          {filteredGoats.map((item) => (
            <div key={item._id || item.tag_id} className="livestock-card">
              <div className="card-image-wrapper">
                <img
                  src={
                    item.image_url ||
                    "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={item.title || `Goat ${item.tag_id}`}
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