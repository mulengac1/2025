Admin Dashboard 

Install Dependencies
npm install express mongoose cors dotenv

server/models/Reservation.js
const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
customerName: String,
email: String,
phone: String,
restaurant: String,
date: Date,
time: String,
guests: Number,
status: { type: String, default: 'pending' }, // pending, confirmed, canceled
createdAt: { type: Date, default: Date.now },
});
const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
server/routes/admin.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
// Get all reservations
router.get('/reservations', async (req, res) => {
try {
const reservations = await Reservation.find();
res.json(reservations);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
// Update reservation status
router.put('/reservations/:id', async (req, res) => {
const { status } = req.body;
try {
const reservation = await Reservation.findByIdAndUpdate(
  req.params.id,
  { status },
  { new: true }
);
res.json(reservation);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
module.exports = router;
server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
// API Routes
app.use('/admin', adminRoutes);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


npm install axios react-router-dom styled-components

src/pages/AdminDashboard.js
import React, { useState,


npm install nodemailer dotenv

Environment Variables (.env)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
Note: If using Gmail, enable “Less Secure App Access” or generate an App Password.
Email Utility Function
server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (to, subject, text) => {
try {
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const mailOptions = {
  from: process.env.EMAIL_USER,
  to,
  subject,
  text,
};
const info = await transporter.sendMail(mailOptions);
console.log('Email sent:', info.response);
} catch (error) {
console.error('Error sending email:', error);
}
};
module.exports = sendEmail;
3. Send Email Notifications for Reservations
Reservation Model
server/models/Reservation.js
const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
customerName: String,
email: String,
phone: String,
restaurant: String,
date: Date,
time: String,
guests: Number,
status: { type: String, default: 'pending' },
createdAt: { type: Date, default: Date.now },
});
const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
Admin Routes with Email Integration
server/routes/admin.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/emailService');
// Get all reservations
router.get('/reservations', async (req, res) => {
try {
const reservations = await Reservation.find();
res.json(reservations);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
// Update reservation status and send email notification
router.put('/reservations/:id', async (req, res) => {
const { status } = req.body;
try {
const reservation = await Reservation.findById(req.params.id);
if (!reservation) {
  return res.status(404).json({ message: 'Reservation not found' });
}
// Update status
reservation.status = status;
await reservation.save();
// Send Email Notification
let subject = '';
let text = '';
if (status === 'confirmed') {
  subject = 'Reservation Confirmed';
  text = `Dear ${reservation.customerName},\n\nYour reservation at ${reservation.restaurant} has been confirmed for ${reservation.date} at ${reservation.time}. Thank you!`;


npm install mongoose dotenv

server/models/EmailLog.js
const mongoose = require('mongoose');
const emailLogSchema = new mongoose.Schema({
recipient: { type: String, required: true },
subject: { type: String, required: true },
status: { type: String, default: 'pending' }, // pending, sent, failed
error: { type: String, default: null },
sentAt: { type: Date, default: Date.now },
});
const EmailLog = mongoose.model('EmailLog', emailLogSchema);
module.exports = EmailLog;

server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const EmailLog = require('../models/EmailLog');
const sendEmail = async (to, subject, text) => {
let emailLog;
try {
// Create log entry before sending email
emailLog = new EmailLog({
  recipient: to,
  subject,
  status: 'pending',
});
await emailLog.save();
// Configure email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Email options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to,
  subject,
  text,
};
// Send email
const info = await transporter.sendMail(mailOptions);
console.log('Email sent:', info.response);
// Update log status to "sent"
emailLog.status = 'sent';
emailLog.sentAt = new Date();
await emailLog.save();
} catch (error) {
console.error('Error sending email:', error);
// Update log status to "failed" with error message
if (emailLog) {
  emailLog.status = 'failed';
  emailLog.error = error.message;
  await emailLog.save();
}
}
};
module.exports = sendEmail;

server/routes/emailLogs.js
const express = require('express');
const router = express.Router();
const EmailLog = require('../models/EmailLog');
// Get all email logs
router.get('/', async (req, res) => {
try {
const logs = await EmailLog.find().sort({ sentAt: -1 });
res.json(logs);
} catch (error) {
res.status(500).json({ message: error.message });
}
});
// Clear logs (optional)
router.delete('/', async (req, res) => {
try {
await EmailLog.deleteMany({});
res.json({ message: 'All logs deleted.' });
} catch ) 
