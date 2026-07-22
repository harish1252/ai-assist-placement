import React, { useState } from "react";
import { sendChatMessage } from "../services/aiService"; // ← add this import

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Placement Assistant 🚀",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ← add this

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]); // add user's message immediately
    setInput("");
    setLoading(true); // show typing indicator

    try {
      const data = await sendChatMessage(input);

      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        sender: "ai",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Chat Section */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-white shadow p-4">
          <h1 className="text-2xl font-bold">AI Placement Assistant</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-sm bg-gray-300 text-black">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-white p-4 flex gap-3 border-t">
          <input
            type="text"
            placeholder="Ask something..."
            className="flex-1 border rounded-lg p-3 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // ← bonus: press Enter to send
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
