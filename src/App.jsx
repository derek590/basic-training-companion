import { Routes, Route, Navigate } from "react-router-dom";
import "./Styles/index.scss";

import BranchSelector from "./Components/BranchSelector";
import SetupScreen from "./Components/SetupScreen";
import PaywallScreen from "./Components/PaywallScreen";
import Dashboard from "./Components/Dashboard";
import { UserProvider } from "./UserContext";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<BranchSelector />} />
        <Route path="/:branchId" element={<SetupScreen />} />
        <Route path="/paywall" element={<PaywallScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}
