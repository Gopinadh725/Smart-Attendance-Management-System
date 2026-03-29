const QRSession = require('../models/QRSession');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const crypto = require('crypto');

// Faculty: Generate QR for the current active period
exports.generateQR = async (req, res) => {
    try {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = days[now.getDay()];
        
        // Add 5 min buffer before class starts
        const bufferTime = new Date(now.getTime() + 5 * 60000);
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const timeWithBuffer = `${String(bufferTime.getHours()).padStart(2, '0')}:${String(bufferTime.getMinutes()).padStart(2, '0')}`;

        // Find if faculty has a class NOW (with 5 min early access)
        const activeTimetable = await Timetable.findOne({
            faculty: req.user._id,
            day,
            $or: [
                { 
                    startTime: { $lte: timeWithBuffer }, 
                    endTime: { $gte: time } 
                },
                {
                    // Special case for midnight wrap (e.g. 22:00 to 00:00)
                    startTime: { $lte: timeWithBuffer },
                    endTime: '00:00'
                }
            ]
        }).populate('subject');

        if (!activeTimetable) {
            return res.status(400).json({ message: 'No active class found for you at this time' });
        }

        // Generate a random token
        const token = crypto.randomBytes(32).toString('hex');
        
        // Expiration in 5 minutes
        const expiresAt = new Date(now.getTime() + 5 * 60000);

        const session = await QRSession.create({
            token,
            subject: activeTimetable.subject,
            faculty: req.user._id,
            timetableEntry: activeTimetable._id,
            expiresAt
        });

        res.json({
            token,
            expiresIn: 300,
            subject: activeTimetable.subject,
            section: activeTimetable.section
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student: Scan and mark attendance
exports.scanQR = async (req, res) => {
    try {
        const { token } = req.body;

        const session = await QRSession.findOne({ token, isActive: true }).populate('subject');

        if (!session || session.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired QR code' });
        }

        // Verify Student Enrollment
        const isEnrolled = session.subject.enrolledStudents.includes(req.user._id);
        if (!isEnrolled) {
            // Check if it's stored as Strings vs ObjectIds
            const isEnrolledString = session.subject.enrolledStudents.some(id => id.toString() === req.user._id.toString());
            if (!isEnrolledString) {
                return res.status(403).json({ message: 'You are not enrolled in this subject' });
            }
        }

        const today = new Date().toISOString().split('T')[0];

        // Mark attendance as Present
        let attendance = await Attendance.findOne({
            subject: session.subject._id,
            date: today
        });

        if (!attendance) {
            attendance = new Attendance({
                subject: session.subject._id,
                faculty: session.faculty,
                date: today,
                students: [{
                    studentId: req.user._id,
                    status: 'Present'
                }]
            });
        } else {
            // Check if student already marked
            const exists = attendance.students.find(s => s.studentId.toString() === req.user._id.toString());
            if (exists) {
                return res.status(400).json({ message: 'Attendance already marked for today' });
            }
            attendance.students.push({
                studentId: req.user._id,
                status: 'Present'
            });
        }

        await attendance.save();
        res.json({ 
            message: 'Attendance marked successfully', 
            subjectName: session.subject.subjectName,
            section: session.subject.section
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
