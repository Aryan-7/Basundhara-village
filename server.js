const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Lead Schema & Model
const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    preferredTime: { type: String },
    projectName: { type: String, default: 'Basundhara Village Phase - I & II' },
    date: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

// API Route to Handle Lead Submission
app.post('/api/leads', async (req, res) => {
    try {
        const { name, phone, email, preferredTime } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required.' });
        }

        const newLead = new Lead({
            name,
            phone,
            email,
            preferredTime
        });

        await newLead.save();
        console.log(`📥 New Lead Saved: ${name} (${phone})`);
        res.status(201).json({ success: true, message: 'Lead saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving lead:', error);
        res.status(500).json({ success: false, message: 'Server error while saving lead.' });
    }
});

// Test Route
app.get('/', (req, res) => {
    res.send('Basundhara Village Backend is running live!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});