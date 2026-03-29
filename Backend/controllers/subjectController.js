const mongoose = require('mongoose');
const Subject = require('../models/Subject');

// @desc    Create a new subject
// @route   POST /api/subject
// @access  Private/Admin
exports.createSubject = async (req, res) => {
    try {
        const { subjectName, subjectCode, facultyId } = req.body;
        const subject = await Subject.create({
            subjectName,
            subjectCode,
            faculty: facultyId
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subjects (for Admin) or assigned subjects (for Faculty)
// @route   GET /api/subject
// @access  Private/Admin/Faculty
exports.getSubjects = async (req, res) => {
    try {
        let subjects;
        if (req.user.role === 'Admin') {
            const rawSubjects = await Subject.find({})
                .populate('faculty', 'name email')
                .populate({
                    path: 'enrolledStudents',
                    select: 'name email rollNumber'
                });

            // Filter out any enrolledStudents that might be null or have invalid ObjectIDs after population
            subjects = rawSubjects.map(sub => {
                const subObject = sub.toObject(); // Convert Mongoose document to plain JavaScript object
                subObject.enrolledStudents = subObject.enrolledStudents.filter(s =>
                    s && s._id && mongoose.Types.ObjectId.isValid(s._id.toString())
                );
                return subObject;
            });
        } else if (req.user.role === 'Faculty') {
            const facultyId = req.user._id || req.user.id;
            console.log(`[DEBUG] Fetching subjects for Faculty: ${facultyId}`);
            subjects = await Subject.find({ faculty: facultyId }).populate('enrolledStudents', 'name email rollNumber');
        } else if (req.user.role === 'Student') {
            const studentId = req.user._id || req.user.id;
            subjects = await Subject.find({ enrolledStudents: studentId }).populate('faculty', 'name email');
        } else {
            subjects = [];
        }
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll students in a subject
// @route   PUT /api/subject/:id/enroll
// @access  Private/Admin/Faculty
exports.enrollStudents = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (subject) {
            const { studentIds } = req.body; // Array of student IDs
            subject.enrolledStudents = [...new Set([...subject.enrolledStudents, ...studentIds])];
            await subject.save();
            res.json({ message: 'Students enrolled successfully' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Sync all students to subjects based on section/semester (Fix-it Tool)
// @route   POST /api/subject/sync
// @access  Private/Admin
exports.syncAllEnrollments = async (req, res) => {
    try {
        const User = require('../models/User');
        const subjects = await Subject.find({});
        let updateCount = 0;

        for (const subject of subjects) {
            if (!subject.section || !subject.semester) continue;

            const matchingStudents = await User.find({
                role: 'Student',
                section: subject.section,
                semester: subject.semester
            });

            const studentIds = matchingStudents.map(s => s._id);
            
            // Merge with existing
            const combined = [...new Set([
                ...(subject.enrolledStudents || []).map(id => id.toString()),
                ...studentIds.map(id => id.toString())
            ])];

            subject.enrolledStudents = combined;
            await subject.save();
            updateCount++;
        }

        res.json({ 
            message: `Sync complete. Updated ${updateCount} subjects.`,
            subjectsUpdated: updateCount 
        });
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ message: error.message });
    }
};
