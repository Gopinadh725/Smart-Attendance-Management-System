const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from your .env file!");
        }

        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");

        console.log('Clearing old data...');
        await User.deleteMany();
        await Subject.deleteMany();
        await Attendance.deleteMany();

        // Remove manual hashing as the User model handles it in pre-save hook
        const password = 'password123';

        console.log('Creating Admin...');
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@college.edu',
            password: password,
            role: 'Admin'
        });

        console.log('Creating Faculty...');
        const faculty1 = await User.create({ name: 'Dr. Smith', email: 'faculty@college.edu', password: password, role: 'Faculty' });
        const faculty2 = await User.create({ name: 'Prof. Jones', email: 'jones@college.edu', password: password, role: 'Faculty' });
        const faculty3 = await User.create({ name: 'Dr. Brown', email: 'brown@college.edu', password: password, role: 'Faculty' });
        const faculty4 = await User.create({ name: 'Prof. White', email: 'white@college.edu', password: password, role: 'Faculty' });
        const faculty5 = await User.create({ name: 'Dr. Black', email: 'black@college.edu', password: password, role: 'Faculty' });

        console.log('Creating Students...');
        const student1 = await User.create({ name: 'Teja V', email: 'teja@student.edu', password: password, role: 'Student', rollNumber: 'MCA2024-001' });
        const student2 = await User.create({ name: 'Rahul S', email: 'rahul@student.edu', password: password, role: 'Student', rollNumber: 'MCA2024-002' });
        const student3 = await User.create({ name: 'Sneha K', email: 'sneha@student.edu', password: password, role: 'Student', rollNumber: 'MCA2024-003' });
        const student4 = await User.create({ name: 'Anish M', email: 'anish@student.edu', password: password, role: 'Student', rollNumber: 'MCA2024-004' });
        const student5 = await User.create({ name: 'Priya R', email: 'priya@student.edu', password: password, role: 'Student', rollNumber: 'MCA2024-005' });

        console.log('Creating Subjects...');
        const studentIds = [student1._id, student2._id, student3._id, student4._id, student5._id];
        
        await Subject.create({ subjectName: 'Machine Learning', subjectCode: 'CS401', section: 'A', semester: 1, faculty: faculty1._id, enrolledStudents: studentIds });
        await Subject.create({ subjectName: 'Data Structures', subjectCode: 'CS201', section: 'B', semester: 1, faculty: faculty2._id, enrolledStudents: studentIds });
        await Subject.create({ subjectName: 'Operating Systems', subjectCode: 'CS301', section: 'A', semester: 1, faculty: faculty3._id, enrolledStudents: studentIds });
        await Subject.create({ subjectName: 'Computer Networks', subjectCode: 'CS405', section: 'C', semester: 1, faculty: faculty4._id, enrolledStudents: studentIds });
        await Subject.create({ subjectName: 'Database Systems', subjectCode: 'CS305', section: 'A', semester: 1, faculty: faculty5._id, enrolledStudents: studentIds });
        
        console.log('Creating Initial Allocations...');
        const Timetable = require('./models/Timetable');
        await Timetable.create({ day: 'Monday', startTime: '09:00', endTime: '10:00', subject: (await Subject.findOne({subjectCode:'CS401'}))._id, faculty: faculty1._id, section: 'A' });
        await Timetable.create({ day: 'Monday', startTime: '10:00', endTime: '11:00', subject: (await Subject.findOne({subjectCode:'CS201'}))._id, faculty: faculty2._id, section: 'B' });

        console.log('✅ Database Seeded Successfully!');
        console.log('-------------------------------------------');
        console.log('🧪 DEMO LOGIN CREDENTIALS (Password: password123)');
        console.log('Admin:   admin@college.edu');
        console.log('Faculty: faculty@college.edu');
        console.log('Student: teja@student.edu');
        console.log('-------------------------------------------');
        
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Calling the correct function name!
seedData();