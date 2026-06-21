import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Friend");

  // UI states
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchContacts();
  }, []);

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

  const addContact = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter contact email address.", "error");
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
        error.response?.data?.message || "Failed to add trusted contact. Make sure the user is registered.",
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff1f8,#fff7fd)",
        fontFamily: "var(--sans)",
        color: "#1f1147",
        position: "relative",
      }}
    >
      <style>{`
        .contact-grid-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(31, 17, 71, 0.08) !important;
        }
        .btn-interact {
          transition: all 0.2s ease;
        }
        .btn-interact:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .btn-interact:active {
          transform: translateY(0);
        }
        .input-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-field:focus {
          border-color: #ec4899 !important;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
        }
      `}</style>

      {/* TOAST MESSAGE */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: showSidebar ? "260px" : "0",
          backgroundColor: "white",
          borderRight: showSidebar ? "1px solid #f3d4e7" : "none",
          padding: showSidebar ? "25px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease, padding 0.3s ease",
          boxShadow: showSidebar ? "4px 0 20px rgba(31, 17, 71, 0.04)" : "none",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            cursor: "pointer",
            paddingBottom: "15px",
            borderBottom: "1px solid #fdf2f8",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img src={logo} alt="logo" style={{ width: "40px", height: "40px" }} />
          <h3 style={{ color: "#1f1147", margin: 0, fontWeight: "700", letterSpacing: "-0.5px" }}>
            CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
          </h3>
        </div>

        {/* NAVIGATION LINKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
          <span
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            🏠 Dashboard
          </span>

          <span
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#ec4899",
              fontWeight: "600",
              backgroundColor: "#fdf2f8",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            👥 Trusted Contacts
          </span>

          <span
            onClick={() => navigate("/incidents")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            📝 Report Incident
          </span>

          <span
            onClick={() => navigate("/checkins")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            📍 Check-Ins
          </span>

          <span
            onClick={() => navigate("/alerts")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            🔔 Safety Alerts
          </span>

          <span
            onClick={() => navigate("/ai")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            🤖 AI Safety Chat
          </span>
        </div>

        {/* LOGOUT */}
        <div style={{ paddingTop: "20px", borderTop: "1px solid #f3d4e7" }}>
          <span
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#ef4444",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            🚪 Logout
          </span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            marginBottom: "35px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: "#1f1147",
                padding: "5px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              ☰
            </span>
            <h4 style={{ margin: 0, color: "#6b6375", fontWeight: "500" }}>
              Trusted Contacts Management
            </h4>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "600", color: "#1f1147", fontSize: "15px" }}>
                {user?.name || "Student User"}
              </div>
              <div style={{ fontSize: "12px", color: "#ec4899", fontWeight: "600" }}>
                Active Profile
              </div>
            </div>

            <div
              onClick={() => setShowProfile(!showProfile)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(236,72,153,0.2)",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {showProfile && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 10px 25px rgba(31, 17, 71, 0.12)",
                  minWidth: "220px",
                  textAlign: "center",
                  zIndex: 1000,
                  border: "1px solid #f3d4e7",
                }}
              >
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 10px",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h3 style={{ margin: "0 0 5px", color: "#1f1147", fontSize: "16px" }}>
                  {user?.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px" }}>
                  {user?.email}
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GRID STRUCTURE: FORM LEFT, CONTACTS RIGHT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "35px",
            alignItems: "start",
          }}
        >
          {/* LEFT: FORM CARD */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 25px rgba(31, 17, 71, 0.02)",
              border: "1px solid #f3d4e7",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <span style={{ fontSize: "28px" }}>👥</span>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                Add Trusted Contact
              </h2>
            </div>

            <p style={{ fontSize: "14px", color: "#6b6375", margin: "0 0 25px" }}>
              Add emergency contacts. They will receive automated warnings and your location coordinates when you request help or miss a check-in.
            </p>

            <form onSubmit={addContact} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* EMAIL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Contact's Registered Email
                </label>
                <input
                  type="email"
                  placeholder="name@university.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  required
                />
              </div>

              {/* RELATIONSHIP DROPDOWN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "white",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="Friend">Friend</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Roommate">Roommate</option>
                  <option value="Campus Security">Campus Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-interact"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
                  marginTop: "10px",
                }}
              >
                {isSubmitting ? "Adding Contact..." : "➕ Add Trusted Contact"}
              </button>
            </form>
          </div>

          {/* RIGHT: CONTACTS GRID LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ textAlign: "left" }}>
              <h2 style={{ margin: "0 0 5px", fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                Trusted Circle ({contacts.length})
              </h2>
              <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                These individuals are authorized to view your safety status.
              </p>
            </div>

            {contacts.length === 0 ? (
              /* EMPTY CIRCLE STATE */
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "60px 40px",
                  textAlign: "center",
                  border: "1px solid #f3d4e7",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <div style={{ fontSize: "50px" }}>👥</div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1f1147" }}>
                  Your trusted circle is empty
                </h3>
                <p style={{ margin: 0, color: "#6b6375", maxWidth: "320px", fontSize: "14px" }}>
                  Add family members, roommates, or university security officers so they can be notified in an emergency.
                </p>
              </div>
            ) : (
              /* GRID OF CARDS */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "20px",
                }}
              >
                {contacts.map((contact) => {
                  const initial = contact.trustedUser?.name
                    ? contact.trustedUser.name.charAt(0).toUpperCase()
                    : "C";

                  // Unique background gradient for contact avatars
                  const nameLen = contact.trustedUser?.name?.length || 5;
                  const colors = [
                    "linear-gradient(135deg, #a78bfa, #c084fc)",
                    "linear-gradient(135deg, #f472b6, #fb7185)",
                    "linear-gradient(135deg, #60a5fa, #38bdf8)",
                    "linear-gradient(135deg, #34d399, #6ee7b7)",
                    "linear-gradient(135deg, #fbbf24, #fbbf24)",
                  ];
                  const avatarBg = colors[nameLen % colors.length];

                  // Relationship Tag color codes
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
                      className="contact-grid-card"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        boxShadow: "0 4px 15px rgba(31, 17, 71, 0.01)",
                        border: "1px solid #f3d4e7",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {/* DELETE FLOATING BUTTON */}
                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="btn-interact"
                        title="Remove Contact"
                        style={{
                          position: "absolute",
                          top: "15px",
                          right: "15px",
                          border: "none",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "14px",
                          boxShadow: "0 2px 5px rgba(239, 68, 68, 0.1)",
                        }}
                      >
                        🗑️
                      </button>

                      {/* AVATAR */}
                      <div
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius: "50%",
                          background: avatarBg,
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "24px",
                          fontWeight: "bold",
                          marginBottom: "15px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        {initial}
                      </div>

                      {/* NAME */}
                      <h3
                        style={{
                          margin: "0 0 5px",
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "#1f1147",
                        }}
                      >
                        {contact.trustedUser?.name || "Pending user registration"}
                      </h3>

                      {/* RELATIONSHIP BADGE */}
                      <span
                        style={{
                          backgroundColor: tagBg,
                          color: tagText,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                          letterSpacing: "0.2px",
                        }}
                      >
                        {contact.relationship}
                      </span>

                      {/* EMAIL */}
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          wordBreak: "break-all",
                          textAlign: "center",
                          maxWidth: "100%",
                        }}
                      >
                        ✉️ {contact.trustedUser?.email}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;