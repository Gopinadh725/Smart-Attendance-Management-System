const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
        type: String, // format 'HH:mm'
        required: true
    },
    endTime: {
        type: String, // format 'HH:mm'
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    section: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
