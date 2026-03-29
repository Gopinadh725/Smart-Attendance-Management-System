const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
    date: { 
        type: Date, 
        required: true 
    },
    students: [{
        studentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        status: { 
            type: String, 
            enum: ['Present', 'Absent'], 
            default: 'Absent' 
        }
    }],
    isLocked: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Ensure one attendance record per subject per date
attendanceSchema.index({ subject: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);