import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ChatPage.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessageContent = input.trim();

    // Add user message to UI
    const userMessage = { role: "user", content: userMessageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // --- CORRECTION ICI ---
      // 1. On récupère l'URL depuis les variables d'environnement
      // Si on est en local, on utilise localhost:5000 par défaut
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // 2. On construit l'URL complète
      // Attention: Assure-toi que ta variable Vercel ne finit PAS par un slash '/'
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessageContent }),
      });
      // ----------------------

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (!data.reply) {
        throw new Error("No response received from the assistant");
      }

      const aiMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to send message. Please try again.");

      if (
        err.message.includes("authentication") ||
        err.message.includes("token")
      ) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError("");
  };

  if (!user) return null;

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h1>Food Assistant Chat</h1>
          <p>Ask me about recipes, ingredients, and meal ideas!</p>
        </div>
        <button
          className="clear-chat-btn"
          onClick={handleClearChat}
          disabled={messages.length === 0 || loading}
        >
          Clear Chat
        </button>
      </div>

      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h2>Start a conversation!</h2>
            <p>
              Ask me about recipes, meal planning, ingredients, or food
              suggestions
            </p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? (
                    <span className="avatar-user">👤</span>
                  ) : (
                    <span className="avatar-assistant">🤖</span>
                  )}
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">
                  <span className="avatar-assistant">🤖</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about recipes, meals, or ingredients..."
            disabled={loading}
            className="chat-input"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            {loading ? "⏳" : "📤"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPage;
