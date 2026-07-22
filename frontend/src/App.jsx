import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {

    // ==========================
    // State Variables
    // ==========================

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [animal, setAnimal] = useState("Cow");
    const [purpose, setPurpose] = useState("Purchase");
    const [visitDate, setVisitDate] = useState("");
    const [message, setMessage] = useState("");

    const [inquiries, setInquiries] = useState([]);

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);

    // ==========================
    // Load Inquiries
    // ==========================

    const loadInquiries = async () => {

        try {

            const response = await fetch(`${API_URL}/inquiries`);

            const data = await response.json();

            setInquiries(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadInquiries();

    }, []);

    // ==========================
    // Submit Form
    // ==========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        setSuccessMessage("");

        setErrorMessage("");

        try {

            const response = await fetch(`${API_URL}/inquiries`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    name,

                    phone,

                    email,

                    animal,

                    purpose,

                    visit_date: visitDate,

                    message,

                }),

            });

            const data = await response.json();

            if (response.ok) {

                setSuccessMessage(data.message);

                setName("");
                setPhone("");
                setEmail("");
                setAnimal("Cow");
                setPurpose("Purchase");
                setVisitDate("");
                setMessage("");

                loadInquiries();

            } else {

                setErrorMessage("Submission failed.");

            }

        } catch (error) {

            console.log(error);

            setErrorMessage("Unable to connect to server.");

        }

        setLoading(false);

    };

    // ==========================
    // Delete Inquiry
    // ==========================

    const deleteInquiry = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this inquiry?"
        );

        if (!confirmDelete) {

            return;

        }

        try {

            await fetch(`${API_URL}/inquiries/${id}`, {

                method: "DELETE",

            });

            loadInquiries();

        } catch (error) {

            console.log(error);

        }

    };

        // ==========================
    // JSX
    // ==========================

    return (
        <div className="container">

            <h1>Cattle Farm Management System</h1>

            <h2>Farm Visit & Animal Inquiry Form</h2>

            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}

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

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Inquiry"}
                </button>

            </form>

            <hr />

            <h2>Submitted Inquiries</h2>

            {inquiries.length === 0 ? (

                <p>No inquiries found.</p>

            ) : (

                inquiries.map((inquiry) => (

                    <div
                        className="card"
                        key={inquiry._id}
                    >

                        <h3>{inquiry.name}</h3>

                        <p><strong>Phone:</strong> {inquiry.phone}</p>

                        <p><strong>Email:</strong> {inquiry.email}</p>

                        <p><strong>Animal:</strong> {inquiry.animal}</p>

                        <p><strong>Purpose:</strong> {inquiry.purpose}</p>

                        <p><strong>Visit Date:</strong> {inquiry.visit_date}</p>

                        <p><strong>Message:</strong> {inquiry.message}</p>

                        <button
                            className="delete-btn"
                            onClick={() => deleteInquiry(inquiry._id)}
                        >
                            Delete
                        </button>

                    </div>

                ))

            )}

        </div>
    );

}

export default App;

