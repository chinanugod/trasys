import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    purpose: "",
  });

  const [logs, setLogs] = useState([]);

  // Fetch logs from backend
  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logs");
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Run once when page loads
  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      type: "Movement",
      ...formData,
    };

    try {
      await fetch("http://localhost:5000/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      alert("Log saved!");

      setFormData({
        name: "",
        phone: "",
        companyName: "",
        purpose: "",
      });

      fetchLogs(); // refresh table
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = async (id) => {
    
    try {
      await fetch(`http://localhost:5000/api/logs/${id}/checkout`, {
        method: "PATCH",
      });

      fetchLogs(); // refresh table
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trasys Log System</h1>

      <h2>Add Movement Log</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <br /><br />

        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <br /><br />

        <input name="companyName" placeholder="Company" value={formData.companyName} onChange={handleChange} />
        <br /><br />

        <input name="purpose" placeholder="Purpose" value={formData.purpose} onChange={handleChange} />
        <br /><br />

        <button type="submit">Submit</button>
      </form>

      <hr />

      <h2>Logs</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Time In</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.sn}</td>
              <td>{log.name}</td>
              <td>{log.companyName}</td>
              <td>{log.status}</td>
              <td>{new Date(log.timeIn).toLocaleString()}</td>

              <td>
                {log.status === "Inside" ? (
                  <button onClick={() => handleCheckout(log._id)}>
                    Check-Out
                  </button>
                ) : (
                  "Completed"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;