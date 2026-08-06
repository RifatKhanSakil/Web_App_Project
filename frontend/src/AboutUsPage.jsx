import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function AboutUsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAboutUs()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading About Us info:", err));
  }, []);

  if (loading) return <div>Loading about details...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{data.title}</h1>
      <p><strong>Founded:</strong> {data.founded_year} | <strong>Location:</strong> {data.location}</p>
      <p><em>{data.mission}</em></p>

      <h2>Our Core Values</h2>
      <ul>
        {data.core_values.map((val, idx) => (
          <li key={idx}>{val}</li>
        ))}
      </ul>

      <h2>Farm Facilities</h2>
      <ul>
        {data.farm_facilities.map((facility, idx) => (
          <li key={idx}>{facility}</li>
        ))}
      </ul>
    </div>
  );
}