// 📌 src/components/Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@mui/material";
// import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="sidebar">
      <h3>Support Portal</h3>

      {/* ✅ Navigation Links */}
      <Button onClick={() => navigate("/tickets")} variant="contained">
        Manage Tickets
      </Button>

      {/* ✅ Logout Button */}
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
