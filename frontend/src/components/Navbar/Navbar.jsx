import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>

      <Link 
        to="/dashboard" 
        className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
      >
        Dashboard
      </Link>
      <Link 
        to="/chat" 
        className={`${styles.navLink} ${location.pathname === '/chat' ? styles.active : ''}`}
      >
        Chat
      </Link>
      <Link 
        to="/query" 
        className={`${styles.navLink} ${location.pathname === '/query' ? styles.active : ''}`}
      >
        Query
      </Link>
    </nav>
  );
};

export default Navbar; 