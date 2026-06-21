import { useState } from "react";
import API from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.post(
      "/ai/chat",
      {
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReply(res.data.reply);
  } catch (error) {
    console.log(error);
    setReply("Failed to get response.");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div
        style={{
        minHeight: "100vh",
        backgroundColor: "#fff7fb",
        padding: "40px",
        }}
    >
        {/* Header */}
        <div
        style={{
            background:
            "linear-gradient(135deg,#8b5cf6,#ec4899)",
            color: "white",
            padding: "30px",
            borderRadius: "25px",
            marginBottom: "30px",
            textAlign: "center",
        }}
        >
        <h1>🤖 AI Safety Assistant</h1>

        <p>
            Get instant safety guidance,
            emergency advice, complaint
            letters, and campus support.
        </p>
        </div>

        {/* Suggested Prompts */}
        <div
        style={{
            display: "grid",
            gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
            marginBottom: "30px",
        }}
        >
        <button
            onClick={() =>
            setMessage(
                "Generate a complaint letter to university administration."
            )
            }
        >
            📄 Complaint Letter
        </button>

        <button
            onClick={() =>
            setMessage(
                "What should I do during a campus emergency?"
            )
            }
        >
            🚨 Emergency Advice
        </button>

        <button
            onClick={() =>
            setMessage(
                "Give me hostel safety tips."
            )
            }
        >
            🏠 Hostel Safety
        </button>

        <button
            onClick={() =>
            setMessage(
                "Give me safe travel advice."
            )
            }
        >
            🚶 Travel Safety
        </button>
        </div>

        {/* Question Box */}
        <div
        style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "20px",
            boxShadow:
            "0 5px 15px rgba(0,0,0,0.08)",
        }}
        >
        <textarea
            rows="6"
            placeholder="Ask anything about campus safety..."
            value={message}
            onChange={(e) =>
            setMessage(e.target.value)
            }
            style={{
            width: "100%",
            padding: "15px",
            borderRadius: "15px",
            maxWidth: "900px",
            margin: "30px auto 0",
            border: "1px solid #ddd",
            resize: "none",
            }}
        />

        <div
            style={{
            marginTop: "15px",
            display: "flex",
            gap: "15px",
            }}
        >
            <button
            onClick={askAI}
            disabled={loading}
            style={{
                background:
                "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
            }}
            >
            {loading
                ? "🤖 Thinking..."
                : "Ask AI ➜"}
            </button>

            <button
            onClick={() => {
                setMessage("");
                setReply("");
            }}
            style={{
                padding: "12px 25px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                cursor: "pointer",
            }}
            >
            🗑 Clear
            </button>
        </div>
        </div>

        {/* Response */}
        {reply && (
        <div
            style={{
            marginTop: "30px",
            backgroundColor: "white",
            margin: "30px auto 0",
            padding: "25px",
            borderRadius: "20px",
            boxShadow:
                "0 5px 15px rgba(0,0,0,0.08)",
            }}
        >
            <h3
            style={{
                color: "#1f1147",
            }}
            >
            🤖 AI Response
            </h3>

            <div
            style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                color: "#333",
                fontSize: "16px",
                textAlign: "left",
            }}
            >
            {reply}
            </div>

            <button
            onClick={() =>
                navigator.clipboard.writeText(
                reply
                )
            }
            style={{
                marginTop: "15px",
                background:
                "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
            }}
            >
            📋 Copy Response
            </button>
        </div>
        )}
    </div>
);
}

export default AIChat;