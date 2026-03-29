const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

async function addStudent() {
    await mongoose.connect(process.env.MONGO_URI);
    // Hash the password so bcrypt can read it later
    const hashed = await bcrypt.hash('student123', 10);
    
    await User.findOneAndUpdate(
        { email: 'teja@student.edu' }, 
        { 
            name: 'Teja Venkata',
            email: 'teja@student.edu',
            password: hashed,
            role: 'Student',
            rollNumber: 'MCA2026-01',
            deviceId: null // Resetting this allows a fresh login
        },
        { upsert: true }
    );
    console.log("✅ Student 'teja@student.edu' is ready!");
    process.exit();
}
addStudent();