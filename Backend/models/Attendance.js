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
    date: { type: Date, default: Date.now },
    qrCodeConfig: {
        token: { type: String }, // Secure token generated for the QR
        expiresAt: { type: Date }, // Time-limited restriction 
        attempts: { type: Number, default: 0, max: 5 } // 5-attempt restriction 
    },
    presentStudents: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        scannedAt: { type: Date, default: Date.now }
    }],
    isLocked: { type: Boolean, default: false } // Faculty can lock session after editing 
});

module.exports = mongoose.model('Attendance', attendanceSchema);