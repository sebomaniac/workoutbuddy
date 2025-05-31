import styles from "./Button.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button className={styles.button} onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
