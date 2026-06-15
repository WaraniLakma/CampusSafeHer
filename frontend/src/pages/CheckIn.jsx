import { useEffect, useState } from "react";
import API from "../services/api";

function CheckIn() {
  const [checkIns, setCheckIns] = useState([]);
  const [destination, setDestination] = useState("");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/checkins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCheckIns(res.data.checkIns);
    } catch (error) {
      console.log(error);
    }
  };

  const createCheckIn = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/checkins",
        {
          destination,
          expectedArrivalTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDestination("");
      setExpectedArrivalTime("");

      fetchCheckIns();
    } catch (error) {
      console.log(error);
    }
  };

  const completeCheckIn = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/checkins/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCheckIns();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Safety Check-In</h1>

      <form onSubmit={createCheckIn}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <br />
        <br />

        <input
          type="datetime-local"
          value={expectedArrivalTime}
          onChange={(e) => setExpectedArrivalTime(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Create Check-In</button>
      </form>

      <hr />

      {checkIns.map((checkIn) => (
        <div key={checkIn._id}>
          <h3>Destination: {checkIn.destination}</h3>

          <p>
            Expected Arrival:{" "}
            {new Date(
              checkIn.expectedArrivalTime
            ).toLocaleString()}
          </p>

          <p>Status: {checkIn.status}</p>

          <p>
            Checked In:{" "}
            {checkIn.checkedIn ? "Yes" : "No"}
          </p>

          {!checkIn.checkedIn && (
            <button
              onClick={() =>
                completeCheckIn(checkIn._id)
              }
            >
              Complete Check-In
            </button>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default CheckIn;