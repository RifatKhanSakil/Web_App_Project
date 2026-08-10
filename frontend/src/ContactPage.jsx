import React, { useState } from "react";
import { submitContactForm } from "./api"; // adjust path if needed

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      await submitContactForm(formData);
      setStatus({
        loading: false,
        success: "Thank you! Your message has been sent successfully. We will get back to you shortly.",
        error: null,
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setStatus({
        loading: false,
        success: null,
        error: "Failed to send message. Please try again or reach out to us directly.",
      });
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions about animal availability, Eid bookings, or farm visits? Reach out to us below.</p>
      </div>

      <div className="contact-content-grid">
        {/* Contact Info Card */}
        <div className="contact-info-card">
          <h2>Get in Touch</h2>
          <p className="info-description">
            We are always happy to answer your questions and welcome visitors for farm inspections.
          </p>

          <div className="info-item">
            <span className="info-icon">📍</span>
            <div>
              <strong>Farm Location</strong>
              <p>Cattle Farm Road, Green Valley, Sector 12</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">📞</span>
            <div>
              <strong>Phone Number</strong>
              <p>+880 1700-000000</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">✉️</span>
            <div>
              <strong>Email Address</strong>
              <p>info@cattlefarm.com</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🕒</span>
            <div>
              <strong>Visiting Hours</strong>
              <p>Mon - Sat: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          <h2>Send a Message</h2>
          {status.success && <div className="alert alert-success">{status.success}</div>}
          {status.error && <div className="alert alert-error">{status.error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+8801700000000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Inquiry about Eid Cattle Booking"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your inquiry here..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={status.loading}>
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}