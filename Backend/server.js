const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

// --- 1. IMPORT ROUTES ---
// Make sure the 'routes' folder and 'auth.js' file exist!
// Change this line in server.js:
const authRoutes = require('./routes/authRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const attendanceRoutes = require('./routes/attendanceRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const reportRoutes = require('./routes/reportRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const qrRoutes = require('./routes/qrRoutes');

const app = express();

// --- 2. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- 3. MIDDLEWARE ---
app.use(express.json()); 

// Backend/server.js
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', // <--- ADD THIS EXACT LINE
    'http://192.168.0.194:3001' // Add your network IP too (from your npm start output)
];

app.use(cors({
    origin: true,
    credentials: true 
}));

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url} from ${req.headers.origin}`);
    next();
});

// --- 4. ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/qr', qrRoutes);

// Root test route to check if backend is alive
app.get('/', (req, res) => {
    res.send('Smart Attendance API is running...');
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});