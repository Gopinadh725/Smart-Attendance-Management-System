const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const User = require('../models/User');

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private/Faculty
exports.markAttendance = async (req, res) => {
    try {
        const { subjectId, date, students } = req.body;
        const mongoose = require('mongoose');

        // Filter out any mock/invalid student IDs (like "1", "2", "3") before saving
        const validStudents = students.filter(s => 
            s.studentId && mongoose.Types.ObjectId.isValid(s.studentId)
        );

        if (validStudents.length === 0) {
            return res.status(400).json({ message: 'No valid student IDs provided' });
        }

        // Find and update or create
        const attendance = await Attendance.findOneAndUpdate(
            { subject: subjectId, date: new Date(date) },
            { 
                faculty: req.user._id,
                students: validStudents 
            },
            { upsert: true, new: true }
        );

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a subject on a specific date
// @route   GET /api/attendance/:subjectId/:date
// @access  Private/Faculty/Admin
exports.getAttendanceByDate = async (req, res) => {
    try {
        const attendance = await Attendance.findOne({ 
            subject: req.params.subjectId, 
            date: new Date(req.params.date) 
        }).populate('students.studentId', 'name email rollNumber');

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance record found for this date' });
        }

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance analytics for a subject
// @route   GET /api/attendance/analytics/:subjectId
// @access  Private/Faculty/Admin/Student
exports.getSubjectAnalytics = async (req, res) => {
    try {
        const attendances = await Attendance.find({ subject: req.params.subjectId });
        
        // Calculate percentages per student
        const studentStats = {};
        let totalClasses = attendances.length;

        attendances.forEach(record => {
            record.students.forEach(s => {
                if (!studentStats[s.studentId]) {
                    studentStats[s.studentId] = { present: 0, total: 0 };
                }
                if (s.status === 'Present') {
                    studentStats[s.studentId].present += 1;
                }
                studentStats[s.studentId].total += 1;
            });
        });

        res.json({ totalClasses, studentStats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's own attendance report
// @route   GET /api/attendance/my-report
// @access  Private/Student
exports.getMyReport = async (req, res) => {
    try {
        const subjects = await Subject.find({ enrolledStudents: req.user.id });
        const report = [];

        for (const subject of subjects) {
            const attendances = await Attendance.find({ subject: subject._id });
            let present = 0;
            let total = attendances.length;

            attendances.forEach(record => {
                const studentRecord = record.students.find(s => s.studentId.toString() === req.user.id);
                if (studentRecord && studentRecord.status === 'Present') {
                    present++;
                }
            });

            report.push({
                subjectName: subject.subjectName,
                subjectCode: subject.subjectCode,
                present,
                total,
                percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
            });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};