import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import LogoutButton from "../Buttons/LogoutButton";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <Link
        to="/dashboard"
        className={`underline-animated ${
          location.pathname === "/dashboard" ? styles.active : ""
        }`}
      >
        Dashboard
      </Link>
      <Link
        to="/chat"
        className={`underline-animated ${
          location.pathname === "/chat" ? styles.active : ""
        }`}
      >
        Chat
      </Link>
      <Link
        to="/query"
        className={`underline-animated ${
          location.pathname === "/query" ? styles.active : ""
        }`}
      >
        Query
      </Link>
      <Link
        to="/settings"
        className={`underline-animated ${
          location.pathname === "/settings" ? styles.active : ""
        }`}
      >
        Settings
      </Link>
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
