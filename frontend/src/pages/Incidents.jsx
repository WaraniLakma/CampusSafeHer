import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);

  // Form states
  const [category, setCategory] = useState("Suspicious Activity");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  // UI states
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

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

  useEffect(() => {
    fetchUser();
    fetchIncidents();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result);
      setAttachmentName(file.name);
      showToast("File attached successfully!", "success");
    };
    reader.onerror = (error) => {
      console.log("Error reading file: ", error);
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
      showToast("Please specify the incident location.", "error");
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

    setIsDetectingLocation(true);
    showToast("Retrieving your current coordinates...", "success");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        showToast("Location updated with GPS coordinates!", "success");
        setIsDetectingLocation(false);
      },
      (error) => {
        console.log(error);
        setIsDetectingLocation(false);
        showToast("Unable to fetch location. Please enter manually.", "error");
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
    <DashboardLayout
      activeKey="incidents"
      pageTitle="Incident Reports"
      pageSubtitle="Campus safety reporting center"
      user={user}
      toast={toast}
      onDismissToast={() => setToast(null)}
    >
      <style>{`
        .incident-card-modern {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .incident-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(31, 17, 71, 0.08) !important;
        }
      `}</style>

      {/* HEADER BANNER */}
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
          Incident Reporting Center
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Report campus safety concerns or suspicious activities. You can submit reports openly or 100% anonymously.
        </p>
      </div>

      {/* TWO-COLUMN GRID: FORM LEFT, INCIDENT HISTORY RIGHT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT: REPORT SUBMISSION FORM */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
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
              📝
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
                File an Incident Report
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Reports are forwarded to campus safety staff
              </p>
            </div>
          </div>

          <form onSubmit={createIncident} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* CATEGORY SELECTOR */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="modern-input"
                style={{ cursor: "pointer" }}
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

            {/* LOCATION WITH AUTO-GPS DETECT BUTTON */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Location / Campus Area
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="e.g. Science Library, North Gate, Hostel Block 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="modern-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isDetectingLocation}
                  className="btn-secondary"
                  title="Detect GPS Coordinates"
                  style={{
                    padding: "0 16px",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#7c3aed",
                    flexShrink: 0,
                  }}
                >
                  {isDetectingLocation ? "📍 Locating..." : "📍 GPS"}
                </button>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                  Detailed Description
                </label>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {description.length} characters
                </span>
              </div>
              <textarea
                rows="4"
                placeholder="Describe what occurred, time of event, individuals involved, or important details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="modern-input"
                style={{
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
              />
            </div>

            {/* FILE ATTACHMENT ZONE */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Attach Photo / Document Evidence (Optional)
              </label>

              {attachment ? (
                /* ATTACHMENT PREVIEW CARD */
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    backgroundColor: "#fdf4f9",
                    border: "1px solid #fbcfe8",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                    {attachment.startsWith("data:image") ? (
                      <img
                        src={attachment}
                        alt="Preview"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "24px" }}>📄</span>
                    )}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1f1147",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "200px",
                      }}
                    >
                      {attachmentName || "Attached File"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeAttachment}
                    style={{
                      border: "none",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                /* FILE INPUT TRIGGER */
                <label
                  style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "14px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#ec4899";
                    e.currentTarget.style.backgroundColor = "#fff9fc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }}
                >
                  <span style={{ fontSize: "28px", marginBottom: "6px" }}>📎</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    Upload photo or statement file
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                    PNG, JPG, PDF up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            {/* ANONYMOUS TOGGLE CHECKBOX */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "14px",
                backgroundColor: isAnonymous ? "#fdf2f8" : "#f8fafc",
                border: isAnonymous ? "1px solid #fbcfe8" : "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => setIsAnonymous(!isAnonymous)}
            >
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#ec4899", cursor: "pointer" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#1f1147" }}>
                  Submit Anonymously 🕵️
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Your personal identity & email will be completely concealed from reports.
                </div>
              </div>
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
              {isSubmitting ? "Submitting Report..." : "Submit Incident Report ➜"}
            </button>
          </form>
        </div>

        {/* RIGHT: INCIDENT REPORTS HISTORY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
              Your Filed Reports ({incidents.length})
            </h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Track investigations and review updates from security
            </p>
          </div>

          {incidents.length === 0 ? (
            /* EMPTY INCIDENTS STATE */
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
                🛡️
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
                No incidents reported
              </h3>
              <p style={{ margin: 0, color: "#64748b", maxWidth: "340px", fontSize: "14px", lineHeight: "1.6" }}>
                You have not filed any incident reports. If you witness or experience suspicious behavior, you can report it safely here.
              </p>
            </div>
          ) : (
            /* INCIDENTS CARDS LIST */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {incidents.map((incident) => {
                let statusBg = "#fef3c7";
                let statusColor = "#b45309";
                if (incident.status === "Under Review") {
                  statusBg = "#dbeafe";
                  statusColor = "#1d4ed8";
                } else if (incident.status === "Resolved") {
                  statusBg = "#dcfce7";
                  statusColor = "#15803d";
                }

                return (
                  <div
                    key={incident._id}
                    className="incident-card-modern"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "22px",
                      padding: "24px",
                      boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
                      border: "1px solid #f3d4e7",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {/* CARD HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            backgroundColor: "#fdf2f8",
                            color: "#be185d",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "4px 12px",
                            borderRadius: "20px",
                          }}
                        >
                          {incident.category}
                        </span>

                        {incident.isAnonymous && (
                          <span
                            style={{
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              fontWeight: "700",
                              fontSize: "11px",
                              padding: "4px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            🕵️ Anonymous
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            backgroundColor: statusBg,
                            color: statusColor,
                            fontWeight: "700",
                            fontSize: "11px",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            textTransform: "uppercase",
                          }}
                        >
                          ● {incident.status}
                        </span>

                        <button
                          onClick={() => deleteIncident(incident._id)}
                          title="Delete report"
                          style={{
                            border: "none",
                            backgroundColor: "#fef2f2",
                            color: "#ef4444",
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p style={{ margin: 0, fontSize: "15px", color: "#1f1147", lineHeight: "1.6", fontWeight: "500" }}>
                      {incident.description}
                    </p>

                    {/* LOCATION & DATE */}
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#64748b" }}>
                      <div>📍 {incident.location}</div>
                      <div>📅 {formatDate(incident.createdAt)}</div>
                    </div>

                    {/* ATTACHMENT VIEW */}
                    {incident.attachment && (
                      <div
                        style={{
                          marginTop: "4px",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "fit-content",
                        }}
                      >
                        {incident.attachment.startsWith("data:image") ? (
                          <img
                            src={incident.attachment}
                            alt="Attachment"
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "20px" }}>📄</span>
                        )}
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                          {incident.attachmentName || "Attached Evidence"}
                        </span>
                      </div>
                    )}
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

export default Incidents;
