import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EditTicket from "./components/EditTicket";
import TicketDetails from "./components/TicketDetails";
import Login from "./components/Login"; // ✅ Import Login component
import ManageTickets from "./components/ManageTickets";
import AgentDashboard from "./components/AgentDashBoard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* ✅ Ensure this exists */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<ManageTickets />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} /> 
        <Route path="/edit-ticket/:id" element={<EditTicket />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
        <Route path="/" element={<Login />} /> {/* Redirect to login by default */}
      </Routes>
    </Router>
  );
};

export default App;
