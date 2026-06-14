import { useState } from "react";
import API from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const askAI = async () => {
    try {
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
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Safety Assistant</h1>

      <textarea
        rows="5"
        cols="50"
        placeholder="Ask a safety question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />
      <br />

      <button onClick={askAI}>
        Ask AI
      </button>

      <hr />

      <h3>Response</h3>

      <pre
        style={{
            whiteSpace: "pre-wrap",
            fontFamily: "Arial",
            textAlign: "left",
        }}
        >
          {reply}
      </pre>
    </div>
  );
}

export default AIChat;