import { useEffect, useState } from "react";
import API from "../services/api";

function Contacts() {
  const [contacts, setContacts] = useState([]);

  const [email, setEmail] = useState("");
  const [relationship, setRelationship] =
    useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts(res.data.contacts);
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/contacts",
        {
          email,
          relationship,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmail("");
      setRelationship("");

      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trusted Contacts</h1>

      <form onSubmit={addContact}>
        <input
          type="email"
          placeholder="Trusted Contact Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Relationship"
          value={relationship}
          onChange={(e) =>
            setRelationship(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Add Contact
        </button>
      </form>

      <hr />

      {contacts.map((contact) => (
        <div key={contact._id}>
          <h3>
            {contact.email ||
              "Email not available"}
          </h3>

          <p>
            Relationship:{" "}
            {contact.relationship}
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Contacts;