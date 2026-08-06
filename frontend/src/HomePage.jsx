import React from "react";

export default function HomePage({ setActivePage }) {
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Premium Cattle & Goat Farm</h1>
          <p className="hero-subtitle">
            Providing healthy, ethically raised livestock for daily needs, breeding, and Qurbani / Eid sales.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => setActivePage("cattle")}
            >
              Browse Cattle
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActivePage("eid-booking")}
            >
              Eid Booking Info
            </button>
          </div>
        </div>
      </section>

      {/* Featured Livestock Categories */}
      <section className="featured-section">
        <h2 className="section-title">Our Featured Categories</h2>
        <div className="category-grid">
          <div
            className="category-card"
            onClick={() => setActivePage("cattle")}
          >
            <div className="card-icon">🐂</div>
            <h3>Cattle</h3>
            <p>Explore high-quality bulls, cows, and calves with verified weight logs and health status.</p>
            <span className="card-link">View Cattle &rarr;</span>
          </div>

          <div
            className="category-card"
            onClick={() => setActivePage("goat")}
          >
            <div className="card-icon">🐐</div>
            <h3>Goats</h3>
            <p>Browse our collection of healthy goats carefully raised for breeding and sacrificed events.</p>
            <span className="card-link">View Goats &rarr;</span>
          </div>

          <div
            className="category-card"
            onClick={() => setActivePage("eid-booking")}
          >
            <div className="card-icon">🌙</div>
            <h3>Qurbani & Eid Sales</h3>
            <p>Reserve your animal in advance with clear booking rules, advance payments, and date schedules.</p>
            <span className="card-link">Booking Details &rarr;</span>
          </div>
        </div>
      </section>
    </div>
  );
}