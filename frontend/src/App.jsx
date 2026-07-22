import { useState } from "react";
import "./App.css";

function App() {

  // State Variables

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [animal, setAnimal] = useState("Cow");
  const [purpose, setPurpose] = useState("Purchase");
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState("");


  // Handle Form Submission

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form submitted!");

    console.log({
      name,
      phone,
      email,
      animal,
      purpose,
      visitDate,
      message,
    });
  };


  // JSX Starts Here

  return (
    <div className="container">

      <h1>Cattle Farm Management System</h1>

      <h2>Farm Visit & Animal Inquiry Form</h2>

      <form onSubmit={handleSubmit}>

        {/* Name */}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />


        {/* Phone Number */}

        <label>Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />


        {/* Email */}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />


        {/* Animal Selection */}

        <label>Select Animal</label>
        <select
          value={animal}
          onChange={(event) => setAnimal(event.target.value)}
        >
          <option value="Cow">Cow</option>
          <option value="Goat">Goat</option>
        </select>


        {/* Purpose Selection */}

        <label>Purpose</label>
        <select
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
        >
          <option value="Purchase">Purchase</option>
          <option value="Farm Visit">Farm Visit</option>
        </select>


        {/* Visit Date */}

        <label>Preferred Visit Date</label>
        <input
          type="date"
          value={visitDate}
          onChange={(event) => setVisitDate(event.target.value)}
          required
        />


        {/* Message */}

        <label>Message</label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows="5"
          required
        />


        {/* Submit Button */}

        <button type="submit">
          Submit Inquiry
        </button>

      </form>

    </div>
  );
}

export default App;