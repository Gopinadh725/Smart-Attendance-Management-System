const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subject = require('./models/Subject');

const fixDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected!");

        console.log("Finding all students...");
        const students = await User.find({ role: 'Student' });
        const studentIds = students.map(s => s._id);

        if (studentIds.length === 0) {
            console.log("❌ No students found. Please run seed.js first.");
            process.exit(1);
        }

        console.log(`Found ${studentIds.length} students. Updating subjects...`);

        // Force update all subjects to have these real student IDs
        const result = await Subject.updateMany(
            {}, 
            { $set: { enrolledStudents: studentIds } }
        );

        console.log(`✅ Updated ${result.modifiedCount} subjects with correct student ObjectIds.`);
        console.log("You should now be able to mark attendance without 'Cast Error'.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

fixDB();
