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
      alert(
        "Trusted contact added successfully"
      );

      setEmail("");
      setRelationship("");

      fetchContacts();
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to add trusted contact"
        );

        console.log(error);
    }
  };
  const deleteContact = async (id) => {
    try {
        const token =
        localStorage.getItem("token");

        await API.delete(
        `/contacts/${id}`,
        {
            headers: {
            Authorization:
                `Bearer ${token}`,
            },
        }
        );
        alert(
        "Trusted contact deleted successfully"
        );

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
            {contact.trustedUser?.name}
          </h3>

          <p>
            Email: {contact.trustedUser?.email}
          </p>

           <p>
            Relationship: {contact.relationship}
            </p>

            <button
            onClick={() =>
                deleteContact(contact._id)
            }
            >
            🗑 Delete
            </button>

            <hr />
        </div>
      ))}
    </div>
  );
}

export default Contacts;