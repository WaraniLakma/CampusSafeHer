import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Incidents from "./pages/Incidents";
import CheckIn from "./pages/CheckIn";
import AIChat from "./pages/AIChat";
import AdminDashboard from "./pages/AdminDashboard";
import Alerts from "./pages/Alerts";
import HomePage from "./pages/HomePage";
import AccountType from "./pages/AccountType";
import AdminLogin from "./pages/AdminLogin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/checkins" element={<CheckIn />} />
        <Route path="/ai" element={<AIChat />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;