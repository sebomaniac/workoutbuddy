import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/LogIn";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Welcome to Workout Buddy</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
