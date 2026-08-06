import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function EidBookingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEidBooking()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading Eid Booking info:", err));
  }, []);

  if (loading) return <div>Loading booking details...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{data.title}</h1>
      <p><strong>Status:</strong> {data.booking_status}</p>
      <p><strong>Required Advance:</strong> {data.advance_payment_percentage}%</p>

      <h2>Booking Rules</h2>
      <ul>
        {data.rules.map((rule, idx) => (
          <li key={idx}>{rule}</li>
        ))}
      </ul>

      <h2>Important Schedule</h2>
      <ul>
        <li><strong>Start Date:</strong> {data.important_dates.booking_start_date}</li>
        <li><strong>End Date:</strong> {data.important_dates.booking_end_date}</li>
        <li><strong>Delivery Begins:</strong> {data.important_dates.delivery_start_date}</li>
      </ul>
    </div>
  );
}