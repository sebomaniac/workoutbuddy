import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OnboardingForm from "./pages/Onboarding/OnboardingForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing/Landing";
import "./index.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<OnboardingForm type="Log In" />} />
          <Route path="/signup" element={<OnboardingForm type="Sign Up" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
