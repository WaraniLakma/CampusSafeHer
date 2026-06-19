import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchAllIncidents();
  }, []);

  const fetchAllIncidents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/admin/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data.incidents);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/admin/incidents/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAllIncidents();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h2>All Incident Reports</h2>

      <hr />

      {incidents.map((incident) => (
        <div key={incident._id}>
          <h3>Category: {incident.category}</h3>

          <p>Description: {incident.description}</p>

          <p>Location: {incident.location}</p>

          <p>Status: {incident.status}</p>

          <p>
            Reported On:{" "}
            {new Date(
              incident.createdAt
            ).toLocaleString()}
          </p>

          <p>
            Anonymous:{" "}
            {incident.isAnonymous ? "Yes" : "No"}
          </p>

          <p>
            Reported By:{" "}
            {incident.isAnonymous
              ? "Anonymous"
              : incident.user?.name}
          </p>

          <p>
            Email:{" "}
            {incident.isAnonymous
              ? "Hidden"
              : incident.user?.email}
          </p>

          <button
            onClick={() =>
              updateStatus(
                incident._id,
                "Under Review"
              )
            }
          >
            Mark Under Review
          </button>

          {" "}

          <button
            onClick={() =>
              updateStatus(
                incident._id,
                "Resolved"
              )
            }
          >
            Mark Resolved
          </button>
          

          

          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;