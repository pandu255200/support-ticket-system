import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/EditTicket.css"; // ✅ Import CSS file

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRef = doc(db, "tickets", id);
        const ticketSnap = await getDoc(ticketRef);

        if (ticketSnap.exists()) {
          setTicket(ticketSnap.data());
        } else {
          console.error("Ticket not found");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, ticket);
      alert("Ticket updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket.");
    }
  };

  return (
    <div className="edit-ticket-container">
      <h2>Edit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={ticket.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={ticket.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <select name="priority" value={ticket.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status" value={ticket.status} onChange={handleChange}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditTicket;
