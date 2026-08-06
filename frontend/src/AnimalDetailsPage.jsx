import React, { useState, useEffect } from "react";
import { getLivestockById } from "./api"; // adjust path if needed

export default function AnimalDetailsPage({ animalId, onBack, onBook }) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimal() {
      if (!animalId) return;
      try {
        setLoading(true);
        const data = await getLivestockById(animalId);
        setAnimal(data);
      } catch (err) {
        console.error("Failed to fetch animal details:", err);
        setError("Could not load animal details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnimal();
  }, [animalId]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading-spinner">Loading animal details...</div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="details-container">
        <button onClick={onBack} className="btn btn-secondary">
          &larr; Back to Listings
        </button>
        <div className="alert alert-error">{error || "Animal not found."}</div>
      </div>
    );
  }

  const defaultImg =
    animal.category?.toLowerCase() === "goat"
      ? "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80"
      : "https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="details-container">
      <button onClick={onBack} className="btn btn-secondary back-btn">
        &larr; Back to Listings
      </button>

      <div className="details-card-grid">
        {/* Left Column: Image Media */}
        <div className="details-media">
          <img
            src={animal.image_url || defaultImg}
            alt={animal.title || `Animal ${animal.tag_id}`}
            className="details-main-img"
          />
          <span className={`status-badge status-${animal.status?.toLowerCase() || "available"}`}>
            {animal.status || "Available"}
          </span>
        </div>

        {/* Right Column: Key Details */}
        <div className="details-info">
          <h1>{animal.title || `Tag ID: ${animal.tag_id}`}</h1>
          <p className="category-tag">{animal.category || "Livestock"}</p>

          <div className="price-tag">
            {animal.price ? `$${animal.price}` : "Contact for Pricing"}
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Tag ID</span>
              <span className="spec-value">{animal.tag_id || "N/A"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Breed</span>
              <span className="spec-value">{animal.breed || "Standard"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Weight</span>
              <span className="spec-value">{animal.weight ? `${animal.weight} kg` : "N/A"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Age</span>
              <span className="spec-value">{animal.age ? `${animal.age} months` : "N/A"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Health Status</span>
              <span className="spec-value">{animal.health_status || "Vaccinated & Healthy"}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Feeding Diet</span>
              <span className="spec-value">{animal.diet || "Organic Grass & Grain"}</span>
            </div>
          </div>

          {animal.description && (
            <div className="details-description">
              <h3>Description</h3>
              <p>{animal.description}</p>
            </div>
          )}

          <div className="details-actions">
            <button
              className="btn btn-primary"
              onClick={() => onBook && onBook(animal)}
              disabled={animal.status?.toLowerCase() === "sold"}
            >
              {animal.status?.toLowerCase() === "booked"
                ? "Inquire About Reservation"
                : animal.status?.toLowerCase() === "sold"
                ? "Item Sold"
                : "Book / Reserve Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}