import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    purpose: "",
  });

  const [filter, setFilter] = useState("");

  const [logs, setLogs] = useState([]);

  const [logType, setLogType] = useState("Movement"); // Default log type

  // Fetch logs from backend
  const fetchLogs = async (filterValue = "") => {
    try {
      let url = "http://localhost:5000/api/logs";
      if (filterValue) {
        url += `?${filterValue}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Run once when page loads
  useEffect(() => {
    fetchLogs(filter);
  }, [filter]);

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
      type: logType, // Add log type to data
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Trasys Dashboard</h1>

      <h4>Select Log Type</h4>

    <select value={logType} onChange={(e) => setLogType(e.target.value)}>
    <option value="Movement">Movement</option>
    <option value="Device">Device</option>
    <option value="WorkAccess">Work Access</option>
    </select>

  <hr />

  {/* Main Layout */}
  <div style={{ display: "flex", gap: "50px" }}>

    {/* LEFT SIDE — FORM */} 
    <div style={{ flex: 1 }}>

      <h2>Add Log</h2>

       {/* Form fields will change based on log type */}
<form onSubmit={handleSubmit}>
  {logType === "Movement" && (
    <>
      <input name="name" placeholder="Name" value={formData.name} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="phone" placeholder="Phone" value={formData.phone} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="companyName" placeholder="Company" value={formData.companyName} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="purpose" placeholder="Purpose" value={formData.purpose} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </>
  )}

  {logType === "Device" && (
    <>
      <input name="name" placeholder="Name" value={formData.name} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
      
      <input name="companyName" placeholder="Company" value={formData.companyName} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="deviceDescription" placeholder="Device Description" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="serialNumber" placeholder="Serial Number" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="qtyIn" type="number" placeholder="Quantity In" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="qtyOut" type="number" placeholder="Quantity Out" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </> 
  )}

  {logType === "WorkAccess" && (
    <>
      <input name="name" placeholder="Name" value={formData.name} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="phone" placeholder="Phone" value={formData.phone} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
      
      <input name="companyName" placeholder="Company" value={formData.companyName} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="contactPerson" placeholder="Contact Person" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="workArea" placeholder="Work Area" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="typeOfWork" placeholder="Type of Work" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="accessRefNumber" placeholder="Reference Number" style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </>
  )}

  <button style={{ marginBottom: "10px" }} type="submit">Submit</button>
</form> 
      </div> 
      
      {/* RIGHT SIDE — TABLE + FILTER */} 
      <div style={{ flex: 2 }}>
 
 <h2>Filters</h2>

  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("")}>All</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=Movement")}>Movement</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=Device")}>Device</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=WorkAccess")}>Work Access</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("status=Inside")}>Inside Only</button>

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
              <td>{log.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}

export default App;