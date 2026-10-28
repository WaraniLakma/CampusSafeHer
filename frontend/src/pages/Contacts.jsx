import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Friend");

  // UI states
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(res.data.contacts || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchContacts();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
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

      showToast("Trusted contact added successfully!", "success");
      setEmail("");
      setRelationship("Friend");
      fetchContacts();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to add contact. Make sure the user is registered.",
        "error"
      );
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to remove this trusted contact?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Trusted contact removed.", "success");
      fetchContacts();
    } catch (error) {
      console.log(error);
      showToast("Failed to remove contact.", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <DashboardLayout
      activeKey="contacts"
      pageTitle="Trusted Contacts"
      pageSubtitle="Manage your emergency network"
      user={user}
      toast={toast}
      onDismissToast={() => setToast(null)}
    >
      <style>{`
        .contact-card-modern {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(31, 17, 71, 0.08) !important;
          border-color: #f472b6 !important;
        }
      `}</style>

      {/* HEADER HERO BANNER */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.2vw, 2.3rem)",
            color: "#1f1147",
            fontWeight: "800",
            margin: "0 0 6px",
          }}
        >
          Trusted Circle Management
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Your trusted contacts receive instant alerts with your live coordinates whenever you trigger an SOS or fail to complete a check-in.
        </p>
      </div>

      {/* TWO-COLUMN GRID: FORM LEFT, CONTACTS LIST RIGHT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT: ADD CONTACT FORM CARD */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              👥
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Add Trusted Contact
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Must be a registered CampusSafeHer user
              </p>
            </div>
          </div>

          <form onSubmit={addContact} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* EMAIL */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Contact's Registered Email
              </label>
              <input
                type="email"
                placeholder="e.g. friend@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            {/* RELATIONSHIP DROPDOWN */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="modern-input"
                style={{ cursor: "pointer" }}
              >
                <option value="Friend">🤝 Friend / Classmate</option>
                <option value="Parent / Guardian">👨‍👩‍👧 Parent / Guardian</option>
                <option value="Sibling">👧 Sibling</option>
                <option value="Spouse / Partner">❤️ Spouse / Partner</option>
                <option value="Roommate">🏠 Roommate</option>
                <option value="Campus Security">🛡️ Campus Security</option>
                <option value="Other">👤 Other</option>
              </select>
            </div>

            {/* INFO CALLOUT */}
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                backgroundColor: "#f5f3ff",
                border: "1px solid #ddd6fe",
                fontSize: "13px",
                color: "#5b21b6",
                lineHeight: "1.5",
              }}
            >
              💡 <strong>Safety Tip:</strong> Add roommates, nearby campus friends, or family who can respond immediately when notified.
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "15.5px",
                fontWeight: "700",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? "Adding Contact..." : "➕ Add to Trusted Circle"}
            </button>
          </form>
        </div>

        {/* RIGHT: CONTACTS CIRCLE LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  margin: "0 0 4px",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Your Trusted Circle ({contacts.length})
              </h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                Authorized recipients of your safety alerts
              </p>
            </div>

            {contacts.length > 0 && (
              <span
                style={{
                  backgroundColor: "#f0fdf4",
                  color: "#15803d",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: "1px solid #bbf7d0",
                }}
              >
                ✓ Protection Active
              </span>
            )}
          </div>

          {contacts.length === 0 ? (
            /* EMPTY CIRCLE STATE */
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                padding: "60px 30px",
                textAlign: "center",
                border: "1px solid #f3d4e7",
                boxShadow: "0 10px 30px rgba(31, 17, 71, 0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  backgroundColor: "#fdf2f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                }}
              >
                👥
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Your circle has no contacts yet
              </h3>
              <p style={{ margin: 0, color: "#64748b", maxWidth: "340px", fontSize: "14px", lineHeight: "1.6" }}>
                Add your family members, roommates, or university friends using the form on the left so they can be notified if you need help.
              </p>
            </div>
          ) : (
            /* CONTACT CARDS GRID */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "18px",
              }}
            >
              {contacts.map((contact) => {
                const initial = contact.trustedUser?.name
                  ? contact.trustedUser.name.charAt(0).toUpperCase()
                  : "C";

                const colors = [
                  "linear-gradient(135deg, #a78bfa, #8b5cf6)",
                  "linear-gradient(135deg, #f472b6, #ec4899)",
                  "linear-gradient(135deg, #38bdf8, #0284c7)",
                  "linear-gradient(135deg, #34d399, #059669)",
                  "linear-gradient(135deg, #fbbf24, #f59e0b)",
                ];
                const nameLength = contact.trustedUser?.name?.length || 5;
                const avatarBg = colors[nameLength % colors.length];

                let tagBg = "#f1f5f9";
                let tagText = "#475569";
                if (contact.relationship === "Campus Security") {
                  tagBg = "#dbeafe";
                  tagText = "#1d4ed8";
                } else if (
                  contact.relationship === "Parent / Guardian" ||
                  contact.relationship === "Sibling"
                ) {
                  tagBg = "#fce7f3";
                  tagText = "#be185d";
                }

                return (
                  <div
                    key={contact._id}
                    className="contact-card-modern"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "22px",
                      padding: "24px",
                      boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
                      border: "1px solid #f3d4e7",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => deleteContact(contact._id)}
                      title="Remove from trusted circle"
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        border: "none",
                        backgroundColor: "#fef2f2",
                        color: "#ef4444",
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "13px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                    >
                      🗑️
                    </button>

                    {/* AVATAR */}
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: avatarBg,
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "24px",
                        fontWeight: "800",
                        marginBottom: "14px",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                      }}
                    >
                      {initial}
                    </div>

                    {/* NAME */}
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: "17px",
                        fontWeight: "700",
                        color: "#1f1147",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {contact.trustedUser?.name || "Pending User"}
                    </h3>

                    {/* RELATIONSHIP BADGE */}
                    <span
                      style={{
                        backgroundColor: tagBg,
                        color: tagText,
                        padding: "3px 12px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        marginBottom: "12px",
                      }}
                    >
                      {contact.relationship}
                    </span>

                    {/* EMAIL */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        wordBreak: "break-all",
                        maxWidth: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "#f8fafc",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        width: "100%",
                        justifyContent: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      <span>✉️</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {contact.trustedUser?.email || "Email undisclosed"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Contacts;
