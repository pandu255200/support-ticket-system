import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button, TextField, MenuItem, FormControlLabel, Checkbox, Radio, RadioGroup } from "@mui/material";

const TicketForm = ({ onClose }) => {
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "Low",
    category: "",
    contactEmail: "",
    phone: "",
    date: "",
    termsAccepted: false,
    issueType: "Bug",
    attachment: null,
  });

  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicket((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTicket((prev) => ({ ...prev, attachment: file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticket.title || !ticket.description || !ticket.contactEmail || !ticket.phone || !ticket.termsAccepted) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    let fileURL = "";
    if (ticket.attachment) {
      const fileRef = ref(storage, `tickets/${ticket.attachment.name}`);
      await uploadBytes(fileRef, ticket.attachment);
      fileURL = await getDownloadURL(fileRef);
    }

    try {
      await addDoc(collection(db, "tickets"), {
        ...ticket,
        attachment: fileURL,
        createdAt: serverTimestamp(),
      });
      alert("Ticket submitted successfully!");
      onClose(); // Close modal after submission
    } catch (error) {
      console.error("Error adding ticket:", error);
      alert("Error submitting ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <TextField label="Title" name="title" fullWidth required value={ticket.title} onChange={handleChange} />
      <TextField label="Description" name="description" fullWidth multiline rows={3} required value={ticket.description} onChange={handleChange} />
      
      <TextField label="Priority" name="priority" select fullWidth value={ticket.priority} onChange={handleChange}>
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>

      <TextField label="Category" name="category" fullWidth value={ticket.category} onChange={handleChange} />

      <TextField label="Contact Email" name="contactEmail" fullWidth required type="email" value={ticket.contactEmail} onChange={handleChange} />
      <TextField label="Phone" name="phone" fullWidth required type="tel" value={ticket.phone} onChange={handleChange} />
      
      <TextField label="Date of Issue" name="date" fullWidth type="date" InputLabelProps={{ shrink: true }} value={ticket.date} onChange={handleChange} />

      <RadioGroup row name="issueType" value={ticket.issueType} onChange={handleChange}>
        <FormControlLabel value="Bug" control={<Radio />} label="Bug" />
        <FormControlLabel value="Feature Request" control={<Radio />} label="Feature Request" />
        <FormControlLabel value="Other" control={<Radio />} label="Other" />
      </RadioGroup>

      <FormControlLabel
        control={<Checkbox name="termsAccepted" checked={ticket.termsAccepted} onChange={handleChange} />}
        label="I agree to the terms and conditions"
      />

      <Button variant="contained" component="label">
        Upload Attachment
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {filePreview && <img src={filePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}

      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Ticket"}
      </Button>
    </form>
  );
};

export default TicketForm;
