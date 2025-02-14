import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase"; // ✅ Correct import
import { doc, getDoc } from "firebase/firestore";
import "../styles/TicketDetails.css"; // ✅ Import CSS file

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRef = doc(db, "tickets", id);
        const ticketSnap = await getDoc(ticketRef);

        if (ticketSnap.exists()) {
          setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
        } else {
          console.error("Ticket not found");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchTicket();
  }, [id]);

  if (!ticket) return <p>Loading ticket details...</p>;

  return (
    <div className="ticket-details-container">
      <h2>Ticket Details</h2>
      <p><strong>Title:</strong> {ticket.title}</p>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Priority:</strong> {ticket.priority}</p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Created By:</strong> {ticket.createdBy}</p>
      <p><strong>Assigned To:</strong> {ticket.assignedTo || "Unassigned"}</p>
    </div>
  );
};

export default TicketDetails;
