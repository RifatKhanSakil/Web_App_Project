import React from "react";

export default function FarmInfoSection() {
  const farmStats = [
    { label: "Total Acres", value: "25+" },
    { label: "Healthy Livestock", value: "300+" },
    { label: "Years Experience", value: "10+" },
    { label: "Satisfied Clients", value: "1,500+" },
  ];

  const highlights = [
    {
      icon: "🌾",
      title: "100% Organic Feeding",
      description: "Our livestock are fed high-quality green grass, silage, and balanced natural grain feed with no artificial hormones.",
    },
    {
      icon: "🩺",
      title: "24/7 Veterinary Care",
      description: "Regular health checkups, vaccination schedules, and continuous monitoring by licensed veterinarians.",
    },
    {
      icon: "🚿",
      title: "Hygienic Housing",
      description: "Spacious, well-ventilated sheds cleaned daily to maintain optimal sanitation and animal comfort.",
    },
  ];

  return (
    <section className="farm-info-section">
      <div className="farm-info-header">
        <h2>About Our Farm & Facilities</h2>
        <p>
          Dedicated to ethical animal husbandry, transparent health records, and premium livestock care.
        </p>
      </div>

      {/* Farm Highlights */}
      <div className="farm-highlights-grid">
        {highlights.map((item, index) => (
          <div key={index} className="highlight-card">
            <div className="highlight-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Farm Stats */}
      <div className="farm-stats-grid">
        {farmStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}