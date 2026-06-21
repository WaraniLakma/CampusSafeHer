const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage =
    message.toLowerCase();

    const isFormalDocument =
    lowerMessage.includes("letter") ||
    lowerMessage.includes("email") ||
    lowerMessage.includes("complaint") ||
    lowerMessage.includes("application") ||
    lowerMessage.includes("report") ||
    lowerMessage.includes("request");

    let prompt;

    if (isFormalDocument) {
    prompt = `
    You are CampusSafeHer AI.

    The user is requesting a formal document.

    Requirements:
    - Output only the requested document.
    - No emojis.
    - No markdown symbols.
    - No bullet points.
    - No decorative formatting.
    - No introductions about yourself.
    - Do not say "I am CampusSafeHer AI".
    - Write professionally.
    - Make it ready to copy and send.

    User Request:
    ${message}
    `;
    } else {
    prompt = `
    You are CampusSafeHer AI.

    The user is asking for advice or guidance.

    Requirements:
    - Be friendly and supportive.
    - Use emojis naturally.
    - Use numbered lists and bullet points.
    - Use short paragraphs.
    - Make the answer engaging and easy to read.
    - Never use markdown symbols like **, ##, ---.

    User Request:
    ${message}
    `;
    }
    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    
    res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};