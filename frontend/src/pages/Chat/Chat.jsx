import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Chat.module.css";
import { getAllWorkoutPlans, chatWithAI } from "../../services/workout";

function Chat() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [planError, setPlanError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const plans = await getAllWorkoutPlans();
        if (plans && plans.length > 0) {
          // Get the most recent plan (first in the array since they're sorted by creation date)
          setCurrentPlanId(plans[0]._id);
        } else {
          setPlanError("No workout plans found. Please create a workout plan first.");
        }
      } catch (error) {
        console.error("Error fetching workout plans:", error);
        setPlanError("Failed to load workout plans. Please try again later.");
      }
    };

    if (user) {
      fetchCurrentPlan();
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!currentPlanId) {
      setMessages(prev => [...prev, {
        type: "error",
        content: "Please create a workout plan first before using the chat.",
        timestamp: new Date()
      }]);
      return;
    }

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatWithAI(inputMessage, currentPlanId);
      const aiMessage = {
        type: "ai",
        content: response.message,
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorContent = "Sorry, I couldn't process your message. Please try again.";
      
      // Check for specific Gemini API overload error
      if (error.message && error.message.includes("503") && error.message.includes("overloaded")) {
        errorContent = "The AI service is currently experiencing high demand. Please try again in a few moments.";
      }
      
      const errorMessage = {
        type: "error",
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        <div className={styles.welcomeText}>
          Chat with AI,{" "}
          <span className={styles.nameHighlight}>{userName}</span>
        </div>
        <Navbar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.chatContainer}>
          <div className={styles.messageArea}>
            {messages.length === 0 ? (
              <div className={styles.placeholder}>
                {planError ? (
                  <div className={styles.errorMessage}>{planError}</div>
                ) : (
                  "Your AI workout assistant is ready to help! Ask questions about exercises, form, or training plans."
                )}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    message.type === "user" ? styles.userMessage : 
                    message.type === "error" ? styles.errorMessage : 
                    styles.aiMessage
                  }`}
                >
                  <div className={styles.messageContent}>{message.content}</div>
                  <div className={styles.messageTimestamp}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputArea}>
            <input 
              type="text" 
              placeholder={currentPlanId ? "Ask me anything about your workout..." : "Please create a workout plan first..."}
              className={styles.chatInput}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !currentPlanId}
            />
            <button 
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={isLoading || !currentPlanId}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 