import { useEffect, useState } from "react";
import API from "../services/api";

function Contacts() {
  const [contacts, setContacts] = useState([]);

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

  return (
    <div>
      <h1>Trusted Contacts</h1>

      {contacts.map((contact) => (
        <div key={contact._id}>
          <h3>{contact.name}</h3>
          <p>{contact.phone}</p>
          <p>{contact.relationship}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Contacts;