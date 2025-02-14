import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../styles/AgentDashBoard.css"; 

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          console.error("User role not found");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (userRole === "agent" && userId) {
      const unsubscribeTickets = onSnapshot(collection(db, "tickets"), (snapshot) => {
        const fetchedTickets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredTickets = fetchedTickets.filter(
          (ticket) => !ticket.assignedTo || ticket.assignedTo === userId
        );

        setTickets(filteredTickets);
      });

      return () => unsubscribeTickets();
    }
  }, [userRole, userId]);

  const assignTicket = async (ticketId) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { assignedTo: userId });
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const updateStatus = async (ticketId, status) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (!loading && userRole !== "agent") {
    return <h2>Access Denied</h2>;
  }

  return (
    <div className="agent-dashboard-container">
      <div className="agent-dashboard-header">
        <h2>Support Agent Dashboard</h2>
        <Button onClick={handleLogout} variant="contained" color="secondary">
          Logout
        </Button>
      </div>

      <div className="agent-dashboard-content">
        {tickets.length === 0 ? (
          <p>No tickets available.</p>
        ) : (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td className={`status-${(ticket.status || "Unknown").toLowerCase().replace(" ", "-")}`}>
                    {ticket.status || "Unknown"}
                  </td>
                  <td>{ticket.priority || "Low"}</td>
                  <td>
                    {ticket.assignedTo ? (
                      ticket.assignedTo === userId ? "You" : "Other Agent"
                    ) : (
                      <Button
                        onClick={() => assignTicket(ticket.id)}
                        variant="contained"
                        color="primary"
                      >
                        Claim
                      </Button>
                    )}
                  </td>
                  <td>
                    {ticket.assignedTo === userId && (
                      <>
                        <Button
                          onClick={() => updateStatus(ticket.id, "In Progress")}
                          variant="contained"
                          color="warning"
                        >
                          In Progress
                        </Button>
                        <Button
                          onClick={() => updateStatus(ticket.id, "Resolved")}
                          variant="contained"
                          color="success"
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => openTicketDetails(ticket)}
                      variant="contained"
                      color="info"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket Details Modal */}
      <Dialog open={!!selectedTicket} onClose={closeTicketDetails}>
        {selectedTicket && (
          <>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogContent>
              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description || "No description provided"}</p>
              <p><strong>Status:</strong> {selectedTicket.status || "Unknown"}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority || "Low"}</p>
              <p><strong>Created By:</strong> {selectedTicket.createdBy || "Unknown"}</p>
              <p><strong>Assigned To:</strong> {selectedTicket.assignedTo ? "You" : "Unassigned"}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeTicketDetails} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default AgentDashboard;
