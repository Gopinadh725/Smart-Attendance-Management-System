const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subject = require('./models/Subject');

const checkDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const userCount = await User.countDocuments();
    const subjectCount = await Subject.countDocuments();
    const faculties = await User.find({ role: 'Faculty' });
    
    console.log('--- DB Check ---');
    console.log('Users:', userCount);
    console.log('Subjects:', subjectCount);
    console.log('Faculties:', faculties.length);
    faculties.forEach(f => console.log(`- ${f.name} (${f.email})`));
    process.exit();
};
checkDB();
