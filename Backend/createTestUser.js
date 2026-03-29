const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing test users to avoid "Duplicate Key" errors
        await User.deleteMany({ email: 'test@gmail.com' });

        const hashedPassword = await bcrypt.hash('123456', 10);

        const newUser = new User({
            name: 'Test Admin',
            email: 'test@gmail.com',
            password: hashedPassword,
            role: 'Admin',
            rollNumber: 'MCA001'
        });

        await newUser.save();
        console.log("✅ Success! User created: test@gmail.com / 123456");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

createTestUser();