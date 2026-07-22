import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const callGroq = async (message) => {
  return fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI placement assistant. Give clear and concise answers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    }),
    signal: AbortSignal.timeout(30000), 
  });
};

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    let response = await callGroq(message);

    if (response.status === 504) {
      console.log("Groq timed out. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await callGroq(message);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq error:", response.status, errorText);
      return res.status(503).json({
        message: "AI service is temporarily unavailable. Please try again.",
      });
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      return res.status(500).json({
        message: "No AI response received",
      });
    }

    return res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("AI error:", error);

    if (error.name === "TimeoutError") {
      return res.status(504).json({
        message: "The AI request took too long. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
