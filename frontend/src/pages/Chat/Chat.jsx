import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Chat.module.css";

function Chat() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const userName = user?.name || "User";

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
            <div className={styles.placeholder}>
              Your AI workout assistant is ready to help! 
              Ask questions about exercises, form, or training plans.
            </div>
          </div>
          <div className={styles.inputArea}>
            <input 
              type="text" 
              placeholder="Ask me anything about your workout..."
              className={styles.chatInput}
            />
            <button className={styles.sendButton}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 