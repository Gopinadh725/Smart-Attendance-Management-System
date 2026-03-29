const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

async function addFaculty() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const hashed = await bcrypt.hash('faculty123', 10);
        
        await User.findOneAndUpdate(
            { email: 'faculty@college.edu' }, 
            { 
                name: 'Dr. Ramesh (MCA Dept)',
                email: 'faculty@college.edu',
                password: hashed,
                role: 'Faculty'
            },
            { upsert: true }
        );
        
        console.log("✅ Faculty Account Ready: faculty@college.edu / faculty123");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
addFaculty();