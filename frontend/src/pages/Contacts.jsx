import { useEffect, useState } from "react";
import API from "../services/api";

function Contacts() {
  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");

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
          name,
          phone,
          relationship,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setPhone("");
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Relationship"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
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
          <h3>{contact.name}</h3>
          <p>Phone: {contact.phone}</p>
          <p>Relationship: {contact.relationship}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Contacts;