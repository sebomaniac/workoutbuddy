import styles from "./Button.module.css";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
