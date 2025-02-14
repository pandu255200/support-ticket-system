import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Sidebar from "./Sidebar";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsCollectionRef = collection(db, "tickets");
        const snapshot = await getDocs(ticketsCollectionRef);
        if (!snapshot.empty) {
          const ticketsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTickets(ticketsData);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      alert("Ticket deleted successfully!");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Failed to delete ticket.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Manage Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>CreatedBy</th>
              <th>AssignedTo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.status}</td>
                <td>{ticket.createdBy}</td>
                <td>{ticket.assignedTo || "N/A"}</td>
                <td>
                  <button onClick={() => navigate(`/ticket/${ticket.id}`)}>View</button>
                  <button onClick={() => navigate(`/edit-ticket/${ticket.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(ticket.id)} style={{ color: "red" }}>Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="7">No tickets found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
