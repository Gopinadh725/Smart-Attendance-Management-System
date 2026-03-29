const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');

const deepClean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // 1. Delete ALL attendance records (they might have bad IDs)
        await Attendance.deleteMany({});
        console.log("Cleared Attendance.");

        // 2. Fix all Subjects to use REAL student IDs
        const students = await User.find({ role: 'Student' });
        const studentIds = students.map(s => s._id);
        
        const subjects = await Subject.find({});
        for (const sub of subjects) {
            sub.enrolledStudents = studentIds;
            await sub.save();
        }
        console.log(`Updated ${subjects.length} subjects.`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
deepClean();
