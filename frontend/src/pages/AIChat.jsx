import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

const SUGGESTED_PROMPTS = [
  {
    icon: "📄",
    label: "Draft Complaint Letter",
    desc: "Formal letter to university administration",
    text: "Generate a formal complaint letter to university administration regarding a campus safety concern.",
  },
  {
    icon: "🚨",
    label: "Emergency Protocol",
    desc: "Steps to take during distress or threat",
    text: "What immediate steps should I take if I feel threatened on campus at night?",
  },
  {
    icon: "🏠",
    label: "Hostel & Room Safety",
    desc: "Best practices for residential security",
    text: "Give me the most essential hostel and dormitory safety tips for female students.",
  },
  {
    icon: "🚶‍♀️",
    label: "Late-Night Travel Guide",
    desc: "Commute vigilance and route precautions",
    text: "Give me practical travel advice when walking or commuting late around campus.",
  },
];

function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    fetchUser();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const askAI = async (customMessage) => {
    const query = typeof customMessage === "string" ? customMessage : message;

    if (!query.trim()) {
      showToast("Please enter a question first.", "error");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/ai/chat",
        { message: query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply(res.data.reply);
    } catch (error) {
      console.log(error);
      setReply("I was unable to connect to the safety AI service. Please verify your connection and try again.");
      showToast("Failed to retrieve AI response.", "error");
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
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    showToast("Response copied to clipboard!", "success");
  };

  const clearChat = () => {
    setMessage("");
    setReply("");
  };

  return (
    <DashboardLayout
      activeKey="ai"
      pageTitle="AI Safety Assistant"
      pageSubtitle="24/7 intelligent campus protection & advice"
      user={user}
      toast={toast}
      onDismissToast={() => setToast(null)}
    >
      <style>{`
        .prompt-chip-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .prompt-chip-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 26px rgba(31, 17, 71, 0.08) !important;
          border-color: #ec4899 !important;
        }
      `}</style>

      {/* HEADER HERO BANNER */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
          borderRadius: "28px",
          padding: "36px 40px",
          color: "white",
          boxShadow: "0 14px 35px rgba(139, 92, 246, 0.25)",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
            <span>🤖</span>
            <span>Intelligent Campus Companion</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 3.4vw, 2.4rem)",
              fontWeight: "800",
              margin: "0 0 10px",
              lineHeight: "1.2",
            }}
          >
            Your AI Campus Safety Guardian
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "15.5px",
              color: "rgba(255, 255, 255, 0.92)",
              lineHeight: "1.6",
            }}
          >
            Ask questions about emergency actions, generate official administration complaint letters, or receive safety advice for late-night travel and hostel security.
          </p>
        </div>

        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "44px",
            flexShrink: 0,
          }}
        >
          💡
        </div>
      </div>

      {/* QUICK PROMPT CHIPS */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f1147",
            margin: "0 0 16px",
          }}
        >
          Recommended Prompts
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => {
                setMessage(prompt.text);
                askAI(prompt.text);
              }}
              className="prompt-chip-card"
              style={{
                backgroundColor: "white",
                border: "1.5px solid #f3d4e7",
                borderRadius: "20px",
                padding: "20px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{prompt.icon}</span>
                <span style={{ fontWeight: "700", color: "#1f1147", fontSize: "15px" }}>
                  {prompt.label}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                {prompt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* QUESTION INPUT CARD */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
          border: "1px solid #f3d4e7",
          marginBottom: "28px",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#334155",
          }}
        >
          Type Your Safety Question or Request
        </label>

        <textarea
          rows="4"
          placeholder="Ask for guidance (e.g. 'How should I report an issue to campus security?', 'Write a complaint letter about poor hostel lighting', 'Tips for safe night travel')..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="modern-input"
          style={{
            resize: "vertical",
            lineHeight: "1.6",
            fontSize: "15px",
            marginBottom: "8px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "12px" }}>
          <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            Press <strong>Enter ↵</strong> to send · <strong>Shift+Enter</strong> for newline
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={clearChat}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "white",
                color: "#64748b",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <button
              onClick={() => askAI()}
              disabled={loading}
              className="btn-primary"
              style={{
                padding: "12px 28px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "14.5px",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Thinking..." : "Ask AI ➜"}
            </button>
          </div>
        </div>
      </div>

      {/* AI RESPONSE CARD */}
      {reply && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)",
                }}
              >
                🤖
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#1f1147",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  CampusSafeHer AI Guidance
                </h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Generated advice & safety recommendations
                </span>
              </div>
            </div>

            <button
              onClick={copyResponse}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid #ddd6fe",
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>📋</span>
              <span>Copy Response</span>
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#fdf4f9",
              padding: "24px",
              borderRadius: "18px",
              border: "1px solid #fce7f3",
              color: "#334155",
              fontSize: "15px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
            }}
          >
            {reply}
          </div>
        </div>
      )}

      {/* EMPTY CONVERSATION PROMPT STATE */}
      {!reply && !loading && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "50px 30px",
            textAlign: "center",
            border: "1px solid #f3d4e7",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.03)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "40px" }}>💬</div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: "#1f1147",
            }}
          >
            How can the Safety AI support you?
          </h3>
          <p style={{ margin: 0, color: "#64748b", maxWidth: "420px", fontSize: "14px", lineHeight: "1.6" }}>
            Click one of the suggested prompts above or type your own question to receive safety protocols, advice, and letter drafts.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AIChat;
