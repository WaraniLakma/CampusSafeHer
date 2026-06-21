import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);
  
  // Form states
  const [category, setCategory] = useState("Suspicious Activity");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState(""); // base64 string
  const [attachmentName, setAttachmentName] = useState("");
  
  // UI states
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchIncidents();
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

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncidents(res.data.incidents || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result); // base64 data URL
      setAttachmentName(file.name);
      showToast("File attached successfully!", "success");
    };
    reader.onerror = (error) => {
      console.log("Error converting file: ", error);
      showToast("Error processing file.", "error");
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment("");
    setAttachmentName("");
    showToast("Attachment removed.", "success");
  };

  const createIncident = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast("Please enter an incident description.", "error");
      return;
    }
    if (!location.trim()) {
      showToast("Please specify the location.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/incidents",
        {
          category,
          description,
          location,
          isAnonymous,
          attachment,
          attachmentName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setCategory("Suspicious Activity");
      setDescription("");
      setLocation("");
      setIsAnonymous(false);
      setAttachment("");
      setAttachmentName("");

      showToast("Incident report submitted successfully!", "success");
      fetchIncidents();
    } catch (error) {
      console.log(error);
      showToast("Failed to report incident.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteIncident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incident report?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/incidents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showToast("Incident report deleted.", "success");
      fetchIncidents();
    } catch (error) {
      console.log(error);
      showToast("Failed to delete incident.", "error");
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    showToast("Retrieving your current coordinates...", "success");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        showToast("Location updated successfully!", "success");
      },
      (error) => {
        console.log(error);
        showToast("Unable to fetch location. Please type manually.", "error");
      }
    );
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const formatDate = (dateStr) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
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
        .action-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.08) !important;
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
        .file-upload-zone {
          border: 2px dashed #cbd5e1;
          transition: all 0.3s ease;
        }
        .file-upload-zone:hover {
          border-color: #ec4899;
          background-color: #fff9fc;
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
            onClick={() => navigate("/contacts")}
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
            👥 Trusted Contacts
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

        {/* SIDEBAR PROFILE / LOGOUT */}
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

      {/* MAIN LAYOUT CONTENT */}
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
              Incident Reporting Center
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

        {/* TWO-COLUMN GRID: FORM LEFT, REPORTS RIGHT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "35px",
            alignItems: "start",
          }}
        >
          {/* LEFT: REPORT FORM CARD */}
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
              <span style={{ fontSize: "28px" }}>📝</span>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                Report an Incident
              </h2>
            </div>

            <form onSubmit={createIncident} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* CATEGORY SELECTOR */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Incident Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    backgroundColor: "white",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="Suspicious Activity">🕵️ Suspicious Activity</option>
                  <option value="Threat / Harassment">🗣️ Threat / Harassment</option>
                  <option value="Medical Emergency">🏥 Medical Emergency</option>
                  <option value="Theft / Vandalism">🎒 Theft / Vandalism</option>
                  <option value="Physical Assault">⚠️ Physical Assault</option>
                  <option value="Siren / Alarm Triggered">🔊 Siren / Alarm Triggered</option>
                  <option value="Other Safety Concern">❓ Other Safety Concern</option>
                </select>
              </div>

              {/* LOCATION WITH MAP ICON & AUTO-GET */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Location / Area
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Science Library, West Quad, Hostel Room 3B"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field"
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="btn-interact"
                    title="Get Current Coordinates"
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #8b5cf6",
                      backgroundColor: "white",
                      color: "#8b5cf6",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    📍
                  </button>
                </div>
              </div>

              {/* DESCRIPTION TEXTAREA */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                    Detailed Description
                  </label>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  rows="5"
                  placeholder="Describe the incident. If it's a long statement, copy and paste it here, or upload it as an attachment below."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* FILE UPLOAD ZONE */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Attach Document / Photo / Statement
                </label>
                
                {attachment ? (
                  /* ATTACHMENT PREVIEW */
                  <div
                    style={{
                      border: "1px solid #f3d4e7",
                      borderRadius: "12px",
                      padding: "15px",
                      backgroundColor: "#fff9fc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                      {attachment.startsWith("data:image") ? (
                        <img
                          src={attachment}
                          alt="preview"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            backgroundColor: "#e2e8f0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "20px",
                          }}
                        >
                          📄
                        </div>
                      )}
                      <div style={{ textAlign: "left", overflow: "hidden" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1f1147",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "180px",
                          }}
                        >
                          {attachmentName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>File loaded</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="btn-interact"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        backgroundColor: "#fee2e2",
                        color: "#ef4444",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ) : (
                  /* DROPZONE FIELD */
                  <div
                    className="file-upload-zone"
                    style={{
                      borderRadius: "12px",
                      padding: "25px",
                      textAlign: "center",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>📁</span>
                    <strong style={{ color: "#ec4899", display: "block", marginBottom: "4px" }}>
                      Upload a file or statement
                    </strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Images, PDFs, or Text Documents (Max 5MB)
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,application/pdf,text/*,.doc,.docx"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ANONYMITY PREFERENCE */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Disclosure Identity
                </label>
                <div style={{ display: "flex", gap: "15px" }}>
                  {/* PUBLIC CARD */}
                  <div
                    onClick={() => setIsAnonymous(false)}
                    style={{
                      flex: 1,
                      padding: "15px",
                      borderRadius: "12px",
                      border: `2px solid ${!isAnonymous ? "#ec4899" : "#e2e8f0"}`,
                      backgroundColor: !isAnonymous ? "#fff9fc" : "white",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "20px", display: "block", marginBottom: "5px" }}>👥</span>
                    <strong style={{ fontSize: "13px", color: "#1f1147" }}>Standard Report</strong>
                    <p style={{ fontSize: "11px", color: "#6b6375", margin: "5px 0 0" }}>
                      Identity visible to security admins.
                    </p>
                  </div>

                  {/* ANONYMOUS CARD */}
                  <div
                    onClick={() => setIsAnonymous(true)}
                    style={{
                      flex: 1,
                      padding: "15px",
                      borderRadius: "12px",
                      border: `2px solid ${isAnonymous ? "#ec4899" : "#e2e8f0"}`,
                      backgroundColor: isAnonymous ? "#fff9fc" : "white",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "20px", display: "block", marginBottom: "5px" }}>🕵️</span>
                    <strong style={{ fontSize: "13px", color: "#1f1147" }}>Anonymous Report</strong>
                    <p style={{ fontSize: "11px", color: "#6b6375", margin: "5px 0 0" }}>
                      Student credentials shielded securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
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
                {isSubmitting ? "Submitting Statement..." : "🚀 File Security Statement"}
              </button>

            </form>
          </div>

          {/* RIGHT: HISTORY OF INCIDENT REPORTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ textAlign: "left" }}>
              <h2 style={{ margin: "0 0 5px", fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                Your Reported Statements
              </h2>
              <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                View status updates and details of reports submitted by you.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {incidents.length === 0 ? (
                /* EMPTY STATE */
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "45px 30px",
                    textAlign: "center",
                    border: "1px solid #f3d4e7",
                    color: "#6b6375",
                  }}
                >
                  <span style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>📦</span>
                  <strong style={{ color: "#1f1147" }}>No incidents reported yet</strong>
                  <p style={{ fontSize: "14px", margin: "5px 0 0" }}>
                    If you witness or face any hazard on campus, use the form to alert security.
                  </p>
                </div>
              ) : (
                incidents.map((incident) => {
                  let badgeBg = "#fef3c7";
                  let badgeText = "#d97706";

                  if (incident.status === "Under Review") {
                    badgeBg = "#dbeafe";
                    badgeText = "#2563eb";
                  } else if (incident.status === "Resolved") {
                    badgeBg = "#d1fae5";
                    badgeText = "#059669";
                  }

                  return (
                    <div
                      key={incident._id}
                      className="action-card"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        boxShadow: "0 4px 15px rgba(31, 17, 71, 0.02)",
                        border: "1px solid #f3d4e7",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                      }}
                    >
                      {/* HEADER */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              backgroundColor: "#fdf2f8",
                              color: "#ec4899",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontWeight: "700",
                              fontSize: "12px",
                              textTransform: "uppercase",
                            }}
                          >
                            {incident.category}
                          </span>
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                            {formatDate(incident.createdAt)}
                          </span>
                        </div>

                        <span
                          style={{
                            backgroundColor: badgeBg,
                            color: badgeText,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          ● {incident.status}
                        </span>
                      </div>

                      {/* TEXT / LOCATION */}
                      <div>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "#1f1147",
                            lineHeight: "1.5",
                            margin: "0 0 10px",
                            fontWeight: "500",
                            wordBreak: "break-word",
                          }}
                        >
                          {incident.description}
                        </p>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#475569",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          📍 <strong style={{ color: "#1f1147" }}>Location:</strong> {incident.location}
                        </div>
                      </div>

                      {/* ATTACHMENT DISPLAY */}
                      {incident.attachment && (
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            padding: "10px 15px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {incident.attachment.startsWith("data:image") ? (
                            <img
                              src={incident.attachment}
                              alt="attached"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: "20px" }}>📄</span>
                          )}
                          <a
                            href={incident.attachment}
                            download={incident.attachmentName || "attachment"}
                            style={{
                              fontSize: "13px",
                              color: "#8b5cf6",
                              textDecoration: "none",
                              fontWeight: "600",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                            }}
                          >
                            Download Attachment: {incident.attachmentName || "View File"}
                          </a>
                        </div>
                      )}

                      {/* FOOTER */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "15px",
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        <div>
                          {incident.isAnonymous ? "🕵️ Reported Anonymously" : "👥 Standard Disclosure"}
                        </div>

                        <button
                          onClick={() => deleteIncident(incident._id)}
                          className="btn-interact"
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          🗑️ Delete Report
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Incidents;