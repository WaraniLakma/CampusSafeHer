import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [showSOSPopup, setShowSOSPopup] =
  useState(false);

  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
        try {
            console.log(position.coords);

            const token =
            localStorage.getItem("token");

            if (
            position.coords.accuracy > 1000
            ) {
            alert(
                "Location accuracy is too low. Please move to an open area and try again."
            );
            return;
            }

            await API.post(
            "/sos",
            {
                latitude:
                position.coords.latitude,

                longitude:
                position.coords.longitude,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            alert(
            "🚨 SOS Alert Sent Successfully!\n\nYour current location has been shared with your trusted contacts."
            );

            setShowSOSPopup(false);
        } catch (error) {
            console.log(error);
        }
        },
        (error) => {
        console.log(error);

        alert(
            "Unable to get your location."
        );
        },
        {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        }
    );
    

  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>🛡️ CampusSafeHer</h1>

      <p>
        Your personal campus safety companion for emergency support,
        trusted contacts, incident reporting, and safe travel.
      </p>

      <hr />

      <h2>🚨 Emergency</h2>

      <button
       onClick={() => setShowSOSPopup(true)}
        style={{
          padding: "12px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        SOS Alert
      </button>
      {showSOSPopup && (
        <div
            style={{
            backgroundColor: "#fff3cd",
            border: "2px solid orange",
            padding: "20px",
            marginTop: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            }}
        >
            <h3>⚠️ Send Emergency Alert?</h3>

            <p>
            Your trusted contacts will be
            notified with your current
            location.
            </p>

            <button
            onClick={() =>
                setShowSOSPopup(false)
            }
            style={{
                marginRight: "10px",
            }}
            >
            Cancel
            </button>

            <button
            onClick={handleSOS}
            style={{
                backgroundColor: "red",
                color: "white",
            }}
            >
            Send SOS
            </button>
        </div>
      )}
      <hr />

      <h2>🧭 Safety Features</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button onClick={() => navigate("/contacts")}>
          👨‍👩‍👧 Trusted Contacts
        </button>

        <button onClick={() => navigate("/incidents")}>
          📝 Incident Reports
        </button>

        <button onClick={() => navigate("/checkins")}>
          📍 Safety Check-In
        </button>

        <button onClick={() => navigate("/ai")}>
          🤖 AI Safety Assistant
        </button>
      </div>
    </div>
  );
}

export default Dashboard;