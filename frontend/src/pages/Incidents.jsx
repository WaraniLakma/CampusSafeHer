import { useEffect, useState } from "react";
import API from "../services/api";

function Incidents() {
  const [incidents, setIncidents] = useState([]);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data.incidents);
    } catch (error) {
      console.log(error);
    }
  };

  const createIncident = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/incidents",
        {
          category,
          description,
          location,
          isAnonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategory("");
      setDescription("");
      setLocation("");
      setIsAnonymous(false);

      fetchIncidents();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteIncident = async (id) => {
    try {
        const token =
        localStorage.getItem("token");

        await API.delete(
        `/incidents/${id}`,
        {
            headers: {
            Authorization:
                `Bearer ${token}`,
            },
        }
        );

        alert(
        "Incident deleted successfully"
        );

        fetchIncidents();
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Incident Reports</h1>

      <form onSubmit={createIncident}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br />
        <br />

        <textarea
          rows="4"
          cols="50"
          placeholder="Incident Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Report Anonymously
        </label>

        <br />
        <br />

        <button type="submit">
          Report Incident
        </button>
      </form>

      <hr />

      {incidents.map((incident) => (
        <div key={incident._id}>
          <h3>Category: {incident.category}</h3>

          <p>Description: {incident.description}</p>

          <p>Location: {incident.location}</p>

          <p>
                Reported On:{" "}
                {new Date(incident.createdAt).toLocaleString()}
          </p>

          <p>Status: {incident.status}</p>

          <p>
            Anonymous: {incident.isAnonymous ? "Yes" : "No"}
          </p>
          <button
            onClick={() =>
                deleteIncident(
                incident._id
                )
            }
            >
            🗑 Delete Incident
           </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Incidents;