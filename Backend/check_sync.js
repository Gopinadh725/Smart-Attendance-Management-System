const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subject = require('./models/Subject');

const checkSync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- USERS ---');
        const users = await User.find({ role: 'Faculty' });
        users.forEach(u => console.log(`Faculty: ${u.name} | ID: ${u._id} | Email: ${u.email}`));

        console.log('\n--- SUBJECTS ---');
        const subjects = await Subject.find({}).populate('faculty', 'name');
        subjects.forEach(s => {
            console.log(`Subject: ${s.subjectName} | Code: ${s.subjectCode} | Faculty: ${s.faculty ? s.faculty.name : 'NONE'} | FacultyID: ${s.faculty ? s.faculty._id : 'N/A'}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSync();
