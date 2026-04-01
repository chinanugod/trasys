import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    purpose: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      type: "Movement",
      ...formData,
    };

    try {
      const response = await fetch("http://localhost:5000/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("Saved:", data);

      alert("Log saved successfully!");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        companyName: "",
        purpose: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving log");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trasys Log System</h1>

      <h2>Add Movement Log</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="companyName"
          placeholder="Company"
          value={formData.companyName}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;

/*This code defines a React component for a simple form that allows users to input their name, 
phone number, company name, and purpose. When the form is submitted, 
it sends a POST request to the backend API to save the log data. 
The form also resets after submission, and any errors during the process are caught and displayed to the user.*/