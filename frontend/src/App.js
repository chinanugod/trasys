import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    purpose: "",
  });

  const [editingLogId, setEditingLogId] = useState(null); // Track which log is being edited

  const [filter, setFilter] = useState(""); // e.g. "type=Movement" or "status=Inside"
  
  const [logs, setLogs] = useState([]); // All logs fetched from backend
  
  const [logType, setLogType] = useState("Movement"); // Default log type

  const activeType =
  typeof filter === "string" && filter.includes("type=")
    ? filter.split("=")[1]
    : null;

 
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

  // Fetch logs on page load and when filter changes
  useEffect(() => {
    fetchLogs(filter);
  }, [filter]);

  // Run once when page loads
  useEffect(() => {
    setFormData({});
  }, [logType]);

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

  if (logType === "Movement" && !formData.name) {
    alert("Name is required");
    return;
  }

  if (logType === "Vehicle" && !formData.plateNumber) {
    alert("Plate Number is required");
    return;
  }

  let dataToSend = {
    type: logType,
    ...formData,
  };

  // 🔥 Convert comma-separated to array
  if (dataToSend.vehicleAuthorization) {
    dataToSend.vehicleAuthorization = dataToSend.vehicleAuthorization
      .split(",")
      .map((a) => a.trim());
  }

  if (dataToSend.workAuthorization) {
    dataToSend.workAuthorization = dataToSend.workAuthorization
      .split(",")
      .map((a) => a.trim());
  }

try {
  const url = editingLogId
    ? `http://localhost:5000/api/logs/${editingLogId}`
    : "http://localhost:5000/api/logs";

  const method = editingLogId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  alert(editingLogId ? "Log updated!" : "Log saved!");

  setFormData({});
  setEditingLogId(null);
  fetchLogs();
} catch (error) {
  console.error(error);
}
};

  const handleCheck = async (log, actionType) => {
  try {
    const newLog = {
      ...log,
      _id: undefined, // remove old id
      action: actionType, // "IN" or "OUT"
    };

    await fetch("http://localhost:5000/api/logs?action=IN", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLog),
    });

    fetchLogs();
  } catch (error) {
    console.error("Check error:", error);
  }
};

  const handleEdit = (log) => {
    setEditingLogId(log._id);
    setFormData(log);
    setLogType(log.type);
  }

  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this log?");
  //   if (!confirmDelete) return;

  //   try {
  //     await fetch(`http://localhost:5000/api/logs/${id}`, {
  //       method: "DELETE",
  //     });

  //     fetchLogs(); // refresh table
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //   }
  // };

// Table configuration based on log type. This determines which columns to show for each type. 
  const tableConfig = { // this is refered to as tableConfig in the code, it is an object that defines the columns to display for each log type in the table. Each key in the object corresponds to a log type (e.g., "Movement", "Vehicle", etc.), and the value is an array of column definitions. Each column definition is an object with a "label" (the header text to display) and a "key" (the property name from the log data to display in that column). This configuration allows the table to dynamically show different columns based on the active log type filter.
  Movement: [
    { label: "S/N", key: "sn" },
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Company", key: "companyName" },
    { label: "Purpose", key: "purpose" },
    { label: "Action", key: "action" },
    { label: "Time", key: "createdAt" },
  ],

  Vehicle: [
    { label: "S/N", key: "sn" },
    { label: "Plate No", key: "plateNumber" },
    { label: "Driver", key: "driverName" },
    { label: "Phone", key: "driverPhone" },
    { label: "Make", key: "vehicleMake" },
    { label: "Authorized By", key: "vehicleAuthorization" },
    { label: "Direction", key: "direction" },
    { label: "Cargo Desc", key: "cargoDescription" },
    { label: "Passengers", key: "numberOfPassengers" },
    { label: "Action", key: "action" },
    { label: "Time", key: "createdAt" },
  ],

  Device: [
    { label: "S/N", key: "sn" },
    { label: "Name", key: "name" },
    { label: "Company", key: "companyName" },
    { label: "Device", key: "deviceDescription" },
    { label: "Serial", key: "serialNumber" },
    { label: "Qty In", key: "qtyIn" },
    { label: "Qty Out", key: "qtyOut" },
    { label: "Action", key: "action" },
    { label: "Time", key: "createdAt" },
  ],

  WorkAccess: [
    { label: "S/N", key: "sn" },
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Company", key: "companyName" },
    { label: "Contact Person", key: "contactPerson" },
    { label: "Work Area", key: "workArea" },
    { label: "Type of Work", key: "typeOfWork" },
    { label: "Ref No", key: "accessRefNumber" },
    { label: "Authorized By", key: "workAuthorization" },
    { label: "Action", key: "action" },
    { label: "Time", key: "createdAt" },
  ],

  CarParkBeat: [
    { label: "S/N", key: "sn" },
    { label: "Driver", key: "driverName" },
    { label: "Phone", key: "driverPhone" },
    { label: "Plate", key: "plateNumber" },
    { label: "Color", key: "vehicleColor" },
    { label: "Remarks", key: "remarks" },
    { label: "Action", key: "action" },
    { label: "Time", key: "createdAt" },
  ],
};

// Determine which columns to show based on active type filter
const columnsToUse =
  activeType && tableConfig[activeType]
    ? tableConfig[activeType]
    : tableConfig["Movement"]; // default to Movement columns if type filter is not active
 
if (!Array.isArray(logs)) return null; // or show loading/error

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Trasys Dashboard</h1>

      <h4>Select Log Type</h4>

    <select value={logType} onChange={(e) => setLogType(e.target.value)}>
    <option value="Movement">Movement</option>
    <option value="Vehicle">Vehicle</option>
    <option value="Device">Device</option>
    <option value="WorkAccess">Work Access</option>
    <option value="CarParkBeat">Car Park Beat</option>
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
      <input name="name" placeholder="Name" value={formData.name || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="phone" placeholder="Phone" value={formData.phone || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="companyName" placeholder="Company" value={formData.companyName || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="purpose" placeholder="Purpose" value={formData.purpose || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </>
  )}

  {logType === "Vehicle" && (
    <>
      <input name="plateNumber" placeholder="Plate Number" value={formData.plateNumber || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="vehicleMake" placeholder="Vehicle Make" value={formData.vehicleMake || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="driverName" placeholder="Driver Name" value={formData.driverName || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="driverPhone" placeholder="Driver Phone" value={formData.driverPhone || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="vehicleAuthorization" placeholder="Authorized By" value={formData.vehicleAuthorization || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="purpose" placeholder="Purpose" value={formData.purpose || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <select name="direction" value={formData.direction} style={{ marginBottom: "10px" }} onChange={handleChange}>
        <option value="">Select Direction</option>
        <option value="From">From</option>
        <option value="To">To</option>       
      </select>

      {formData.direction && (
  <>
    <br />
    <input
      name="directionDetail"
      placeholder={
        formData.direction === "From"
          ? "Coming from where?"
          : "Going to where?"
      }
      value={formData.directionDetail || ""}
      onChange={handleChange}
      style={{ marginBottom: "10px" }}
    />
    <br /><br />
  </>
)}
 
      <input name="cargoDescription" placeholder="Cargo Description" value={formData.cargoDescription || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="numberOfPassengers" type="number" placeholder="Number of Passengers" value={formData.numberOfPassengers || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </>
  )}

  {logType === "Device" && (
    <>
      <input name="name" placeholder="Name" value={formData.name || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
      
      <input name="companyName" placeholder="Company" value={formData.companyName || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="deviceDescription" placeholder="Device Description" value={formData.deviceDescription || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="serialNumber" placeholder="Serial Number" value={formData.serialNumber || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="qtyIn" type="number" placeholder="Quantity In" value={formData.qtyIn || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="qtyOut" type="number" placeholder="Quantity Out" value={formData.qtyOut || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </> 
  )}

  {logType === "WorkAccess" && (
    <>
      <input name="name" placeholder="Name" value={formData.name || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="phone" placeholder="Phone" value={formData.phone || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
      
      <input name="companyName" placeholder="Company" value={formData.companyName || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="contactPerson" placeholder="Contact Person" value={formData.contactPerson || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="workArea" placeholder="Work Area" value={formData.workArea || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="typeOfWork" placeholder="Type of Work" value={formData.typeOfWork || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="accessRefNumber" placeholder="Reference Number" value={formData.accessRefNumber || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="workAuthorization" placeholder="Authorized By (comma seperated)" value={formData.workAuthorization || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />
    </>
  )}

  {logType === "CarParkBeat" && (
    <>
      <input name="driverName" placeholder="Driver Name" value={formData.driverName || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="driverPhone" placeholder="Driver Phone" value={formData.driverPhone || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="plateNumber" placeholder="Plate Number" value={formData.plateNumber || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="vehicleMake" placeholder="Vehicle Make" value={formData.vehicleMake || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <input name="vehicleColor" placeholder="Vehicle Color" value={formData.vehicleColor || ""} style={{ marginBottom: "10px" }} onChange={handleChange} />
      <br /><br />

      <textarea name="remarks" placeholder="Remarks" value={formData.remarks || ""} style={{ marginBottom: "10px", height: "60px" }} onChange={handleChange} />
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
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=Vehicle")}>Vehicle</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=Device")}>Device</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=WorkAccess")}>Work Access</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("type=CarParkBeat")}>Car Park Beat</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("action=IN")}>IN Only</button>
  <button style={{ marginBottom: "10px", marginRight: "10px" }} onClick={() => setFilter("action=OUT")}>OUT Only</button>

      <hr />

      <h2>Logs</h2>
      <table border="1" cellPadding="10">
          <thead>
              <tr>
                {columnsToUse.map((col) => (
                <th key={col.key}>{col.label}</th>
                  ))}
                <th>Controls</th>
              </tr>
          </thead>

  <tbody> 
    {logs.map((log) => {
        const columns = columnsToUse;
  
    return (
      <tr key={log._id}
      style={{
        backgroundColor:
          log.action === "OUT" ? "#ffe5e5" : "#e5ffe5",
      }}
      >
        {columns.map((col) => (
          <td key={col.key}>
            {col.key === "createdAt"
              ? new Date(log.createdAt).toLocaleString()
              : col.key === "action"
              ? (log.action === "OUT"
               ? "🔴 OUT"
                : "🟢 IN")                
              : Array.isArray(log[col.key])
              ? log[col.key].join(", ")
              : log[col.key]}
          </td>
        ))}

        <td>
          <button onClick={() => handleCheck(log, "IN")}>
            Check-In
          </button>

          <button onClick={() => handleCheck(log, "OUT")}>
            Check-Out
          </button>

          <button onClick={() => handleEdit(log)}>
            Edit
          </button>

          {/* <button onClick={() => handleDelete(log._id)}>
            Delete
          </button> */}
        </td>
      </tr>
    );
  })}
</tbody>
         
      </table>
      </div>
      </div>
    </div>
  );
};

export default App;