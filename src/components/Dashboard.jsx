import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import '../styles/Dashboard.css';
import Sidebar from "./Sidebar"; // ✅ Import Sidebar

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Low",
    category: "Bug",
    createdBy: "",
    contactPhone: "",
    assignedTo: "",
    dueDate: "",
    status: "Open",
    urgent: false,
    allowNotifications: false,
    attachment: null, // File Upload
  });
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

  // ✅ Open/Close Modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // ✅ Handle Form Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle File Upload
  const handleFileChange = (e) => {
    setNewTicket((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
  };

  // ✅ Submit New Ticket to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tickets"), {
        ...newTicket,
        createdAt: serverTimestamp(),
      });
      setTickets([...tickets, { id: new Date().getTime(), ...newTicket }]); // Temporary UI update
      handleCloseModal();
      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Error adding ticket:", error);
      alert("Failed to create ticket.");
    }
  };

  // ✅ Delete Ticket Function
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
      <Sidebar /> {/* ✅ Sidebar Added */}

      <div className="dashboard-content">
        <h2>Support Dashboard</h2>

        {/* ✅ Button to Open Modal */}
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          + Raise a Ticket
        </Button>

        {/* ✅ Ticket Creation Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Create a New Ticket</DialogTitle>
          <DialogContent>
            <TextField label="Title" name="title" fullWidth value={newTicket.title} onChange={handleChange} required margin="dense" />
            <TextField label="Description" name="description" fullWidth multiline rows={3} value={newTicket.description} onChange={handleChange} required margin="dense" />

            <TextField label="Priority" name="priority" select fullWidth value={newTicket.priority} onChange={handleChange} margin="dense">
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField label="Category" name="category" select fullWidth value={newTicket.category} onChange={handleChange} margin="dense">
              <MenuItem value="Bug">Bug</MenuItem>
              <MenuItem value="Feature Request">Feature Request</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField label="Created By (Email)" name="createdBy" fullWidth value={newTicket.createdBy} onChange={handleChange} required margin="dense" />
            <TextField label="Contact Phone" name="contactPhone" fullWidth type="tel" value={newTicket.contactPhone} onChange={handleChange} margin="dense" />

            <TextField label="Assigned To (Email)" name="assignedTo" fullWidth value={newTicket.assignedTo} onChange={handleChange} margin="dense" />
            
            <TextField label="Due Date" name="dueDate" fullWidth type="date" value={newTicket.dueDate} onChange={handleChange} margin="dense" InputLabelProps={{ shrink: true }} />

            <RadioGroup name="status" value={newTicket.status} onChange={handleChange} row>
              <FormControlLabel value="Open" control={<Radio />} label="Open" />
              <FormControlLabel value="In Progress" control={<Radio />} label="In Progress" />
              <FormControlLabel value="Resolved" control={<Radio />} label="Resolved" />
            </RadioGroup>

            <FormControlLabel control={<Checkbox name="urgent" checked={newTicket.urgent} onChange={handleChange} />} label="Urgent?" />
            <FormControlLabel control={<Checkbox name="allowNotifications" checked={newTicket.allowNotifications} onChange={handleChange} />} label="Allow Notifications?" />

            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} style={{ marginTop: "10px" }} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary">Create</Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Ticket Table */}
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

export default Dashboard;
