import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

const navLinkStyle = {
  padding: "14px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  color: "#555",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "all 0.2s ease",
};

const activeNavStyle = {
  ...navLinkStyle,
  color: "#ec4899",
  fontWeight: "600",
  backgroundColor: "#fdf2f8",
};

const SUGGESTED_PROMPTS = [
  { icon: "📄", label: "Complaint Letter", text: "Generate a complaint letter to university administration." },
  { icon: "🚨", label: "Emergency Advice", text: "What should I do during a campus emergency?" },
  { icon: "🏠", label: "Hostel Safety", text: "Give me hostel safety tips." },
  { icon: "🚶", label: "Travel Safety", text: "Give me safe travel advice." },
];

function AIChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const askAI = async () => {
    if (!message.trim()) {
      showToast("Please enter a question first.", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/ai/chat",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply(res.data.reply);
    } catch (error) {
      console.log(error);
      setReply("Failed to get response. Please try again.");
      showToast("Failed to get AI response.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(reply);
    showToast("Response copied to clipboard!", "success");
  };

  const clearChat = () => {
    setMessage("");
    setReply("");
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
        .btn-interact {
          transition: all 0.2s ease;
        }
        .btn-interact:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .btn-interact:active:not(:disabled) {
          transform: translateY(0);
        }
        .input-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-field:focus {
          border-color: #ec4899 !important;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
        }
        .prompt-chip {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .prompt-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(31, 17, 71, 0.08);
          border-color: #ec4899 !important;
        }
      `}</style>

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

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
          {[
            { path: "/dashboard", icon: "🏠", label: "Dashboard" },
            { path: "/contacts", icon: "👥", label: "Trusted Contacts" },
            { path: "/incidents", icon: "📝", label: "Report Incident" },
            { path: "/checkins", icon: "📍", label: "Check-Ins" },
            { path: "/alerts", icon: "🔔", label: "Safety Alerts" },
            { path: "/ai", icon: "🤖", label: "AI Safety Chat", active: true },
          ].map((item) => (
            <span
              key={item.path}
              onClick={() => !item.active && navigate(item.path)}
              style={item.active ? activeNavStyle : navLinkStyle}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#fdf2f8";
                  e.currentTarget.style.color = "#ec4899";
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#555";
                }
              }}
            >
              {item.icon} {item.label}
            </span>
          ))}
        </div>

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

      {/* MAIN CONTENT */}
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
              style={{ fontSize: "24px", cursor: "pointer", color: "#1f1147", padding: "5px" }}
            >
              ☰
            </span>
            <h4 style={{ margin: 0, color: "#6b6375", fontWeight: "500" }}>
              AI Safety Assistant
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
                <h3 style={{ margin: "0 0 5px", color: "#1f1147", fontSize: "16px" }}>{user?.name}</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px" }}>{user?.email}</p>
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

        {/* INTRO CARD */}
        <div
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            color: "white",
            padding: "30px 35px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 8px 25px rgba(236,72,153,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
            <span style={{ fontSize: "32px" }}>🤖</span>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "white" }}>
              Your AI Safety Companion
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: "15px", opacity: 0.92, maxWidth: "600px", textAlign: "left" }}>
            Get instant safety guidance, emergency advice, complaint letters, and campus support — available anytime you need help.
          </p>
        </div>

        {/* SUGGESTED PROMPTS */}
        <div style={{ marginBottom: "30px", textAlign: "left" }}>
          <h3 style={{ margin: "0 0 15px", fontSize: "16px", fontWeight: "600", color: "#475569" }}>
            Quick Prompts
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => setMessage(prompt.text)}
                className="prompt-chip btn-interact"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #f3d4e7",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px" }}>{prompt.icon}</span>
                <span style={{ fontWeight: "600", color: "#1f1147", fontSize: "14px" }}>
                  {prompt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT INPUT CARD */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 4px 25px rgba(31, 17, 71, 0.02)",
            border: "1px solid #f3d4e7",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
          <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "12px" }}>
            Ask a Question
          </label>
          <textarea
            rows="5"
            placeholder="Ask anything about campus safety, emergencies, hostel tips, or request a complaint letter..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              resize: "none",
              fontSize: "15px",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              lineHeight: "1.6",
            }}
          />
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#94a3b8" }}>
            Press Enter to send · Shift+Enter for new line
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={askAI}
              disabled={loading}
              className="btn-interact"
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "🤖 Thinking..." : "Ask AI ➜"}
            </button>
            <button
              onClick={clearChat}
              className="btn-interact"
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
                color: "#64748b",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              🗑 Clear
            </button>
          </div>
        </div>

        {/* AI RESPONSE */}
        {reply && (
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                🤖
              </div>
              <h3 style={{ margin: 0, color: "#1f1147", fontSize: "18px", fontWeight: "700" }}>
                AI Response
              </h3>
            </div>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                color: "#334155",
                fontSize: "15px",
                backgroundColor: "#fdf2f8",
                padding: "20px 24px",
                borderRadius: "16px",
                border: "1px solid #fce7f3",
              }}
            >
              {reply}
            </div>

            <button
              onClick={copyResponse}
              className="btn-interact"
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(236,72,153,0.2)",
              }}
            >
              📋 Copy Response
            </button>
          </div>
        )}

        {!reply && !loading && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "50px 40px",
              textAlign: "center",
              border: "1px solid #f3d4e7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "48px" }}>💬</div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1f1147" }}>
              Start a conversation
            </h3>
            <p style={{ margin: 0, color: "#6b6375", maxWidth: "400px", fontSize: "14px" }}>
              Pick a quick prompt above or type your own question to get personalized safety guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIChat;
