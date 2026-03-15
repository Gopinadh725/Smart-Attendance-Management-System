const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Admin', 'Faculty', 'Student'], 
        required: true 
    },
    rollNumber: { type: String }, // Required for Students [cite: 4]
    department: { type: String, default: 'Computer Applications' }, // [cite: 6]
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);