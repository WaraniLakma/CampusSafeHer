import { useState } from "react";
import API from "../services/api";

function SOS() {
  const [message, setMessage] = useState("");

  const sendSOS = async () => {
    try {
      const token = localStorage.getItem("token");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          await API.post(
            "/sos",
            {
              latitude,
              longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setMessage("SOS Alert Sent Successfully!");
        },
        () => {
          setMessage("Unable to get location.");
        }
      );
    } catch (error) {
      console.log(error);
      setMessage("Failed to send SOS.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Emergency SOS</h1>

      <button onClick={sendSOS}>
        🚨 SEND SOS ALERT
      </button>

      <br />
      <br />

      <p>{message}</p>
    </div>
  );
}

export default SOS;