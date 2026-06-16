import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Incidents from "./pages/Incidents";
import CheckIn from "./pages/CheckIn";
import AIChat from "./pages/AIChat";
import SOS from "./pages/SOS";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/checkins" element={<CheckIn />} />
        <Route path="/ai" element={<AIChat />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;