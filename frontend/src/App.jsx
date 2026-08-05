import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("inquiry");

  // Form & Inquiry State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [animal, setAnimal] = useState("Cow");
  const [purpose, setPurpose] = useState("Purchase");
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [inquiries, setInquiries] = useState([]);

  // Endpoints Data State
  const [eidBookingData, setEidBookingData] = useState(null);
  const [aboutUsData, setAboutUsData] = useState(null);

  // -----------------------------
  // Load Data Functions
  // -----------------------------
  const loadInquiries = async () => {
    try {
      const response = await fetch(`${API_URL}/inquiry/`);
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error loading inquiries:", error);
    }
  };

  const loadEidBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/eid-booking/`);
      const data = await response.json();
      setEidBookingData(data);
    } catch (error) {
      console.error("Error loading Eid booking info:", error);
    }
  };

  const loadAboutUs = async () => {
    try {
      const response = await fetch(`${API_URL}/about-us/`);
      const data = await response.json();
      setAboutUsData(data);
    } catch (error) {
      console.error("Error loading About Us info:", error);
    }
  };

  useEffect(() => {
    loadInquiries();
    loadEidBooking();
    loadAboutUs();
  }, []);

  // -----------------------------
  // Submit Form
  // -----------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const inquiry = {
      name,
      phone,
      email,
      animal,
      purpose,
      visit_date: visitDate,
      message,
    };

    try {
      const response = await fetch(`${API_URL}/inquiry/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiry),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Inquiry submitted successfully!");

        setName("");
        setPhone("");
        setEmail("");
        setAnimal("Cow");
        setPurpose("Purchase");
        setVisitDate("");
        setMessage("");

        loadInquiries();
      } else {
        setErrorMessage("Failed to submit inquiry.");
      }
    } catch (error) {
      setErrorMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete Inquiry
  // -----------------------------
  const deleteInquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/inquiry/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Deleted successfully");
        loadInquiries();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  // -----------------------------
  // JSX Render
  // -----------------------------
  return (
    <div className="container">
      <h1>Cattle Farm Management System</h1>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("inquiry")}
          style={{ background: activeTab === "inquiry" ? "#007bff" : "#6c757d" }}
        >
          Inquiries
        </button>
        <button
          onClick={() => setActiveTab("eid-booking")}
          style={{ background: activeTab === "eid-booking" ? "#007bff" : "#6c757d" }}
        >
          Eid Booking Info
        </button>
        <button
          onClick={() => setActiveTab("about-us")}
          style={{ background: activeTab === "about-us" ? "#007bff" : "#6c757d" }}
        >
          About Us
        </button>
      </div>

      <hr />

      {/* TAB 1: Inquiries Form & List */}
      {activeTab === "inquiry" && (
        <div>
          <h2>Farm Visit & Animal Inquiry Form</h2>

          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Select Animal</label>
            <select
              value={animal}
              onChange={(e) => setAnimal(e.target.value)}
            >
              <option value="Cow">Cow</option>
              <option value="Goat">Goat</option>
            </select>

            <label>Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="Purchase">Purchase</option>
              <option value="Farm Visit">Farm Visit</option>
            </select>

            <label>Preferred Visit Date</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />

            <label>Message</label>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>

          <hr />

          <h2>Submitted Inquiries</h2>

          {inquiries.length === 0 ? (
            <p>No inquiries found.</p>
          ) : (
            inquiries.map((item) => (
              <div className="card" key={item._id || item.id}>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Animal:</strong> {item.animal}</p>
                <p><strong>Purpose:</strong> {item.purpose}</p>
                <p><strong>Visit Date:</strong> {item.visit_date}</p>
                <p><strong>Message:</strong> {item.message}</p>

                <button
                  className="deleteBtn"
                  onClick={() => deleteInquiry(item._id || item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Eid Booking Info */}
      {activeTab === "eid-booking" && (
        <div>
          <h2>Eid Booking Information</h2>
          {eidBookingData ? (
            <div className="card">
              <h3>{eidBookingData.title}</h3>
              <p><strong>Status:</strong> {eidBookingData.booking_status}</p>
              <p><strong>Advance Payment Required:</strong> {eidBookingData.advance_payment_percentage}%</p>
              
              <h4>Booking Rules</h4>
              <ul>
                {eidBookingData.rules?.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>

              <h4>Important Dates</h4>
              <p><strong>Booking Opens:</strong> {eidBookingData.important_dates?.booking_start_date}</p>
              <p><strong>Booking Closes:</strong> {eidBookingData.important_dates?.booking_end_date}</p>
              <p><strong>Deliveries Begin:</strong> {eidBookingData.important_dates?.delivery_start_date}</p>
            </div>
          ) : (
            <p>Loading Eid Booking Info...</p>
          )}
        </div>
      )}

      {/* TAB 3: About Us */}
      {activeTab === "about-us" && (
        <div>
          <h2>About Our Farm</h2>
          {aboutUsData ? (
            <div className="card">
              <h3>{aboutUsData.title}</h3>
              <p><strong>Mission:</strong> {aboutUsData.mission}</p>
              <p><strong>Founded:</strong> {aboutUsData.founded_year}</p>
              <p><strong>Location:</strong> {aboutUsData.location}</p>

              <h4>Core Values</h4>
              <ul>
                {aboutUsData.core_values?.map((val, idx) => (
                  <li key={idx}>{val}</li>
                ))}
              </ul>

              <h4>Farm Facilities</h4>
              <ul>
                {aboutUsData.farm_facilities?.map((facility, idx) => (
                  <li key={idx}>{facility}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading About Us Info...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;