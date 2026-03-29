const User = require('../models/User');
const Subject = require('../models/Subject');

const autoEnrollStudent = async (studentId, section, semester) => {
    if (!section || !semester) return;
    try {
        const subjects = await Subject.find({ section, semester });
        for (const subject of subjects) {
            if (!subject.enrolledStudents.includes(studentId)) {
                subject.enrolledStudents.push(studentId);
                await subject.save();
            }
        }
    } catch (err) {
        console.error("Auto-Enroll Error:", err);
    }
};

// @desc    Create new user (by Admin)
// @route   POST /api/admin/user
// @access  Private/Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, rollNumber, section, semester } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name, email, password, role, rollNumber, section, semester
        });

        if (role === 'Student') {
            await autoEnrollStudent(user._id, section, semester);
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile & enrollment
// @route   PUT /api/admin/user/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const { role, name, email, rollNumber, section, semester } = req.body;
        const user = await User.findById(req.params.id);
        
        if (user) {
            const wasStudent = user.role === 'Student';
            const oldSection = user.section;
            const oldSemester = user.semester;

            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
            user.rollNumber = rollNumber || user.rollNumber;
            user.section = section || user.section;
            user.semester = semester || user.semester;

            await user.save();

            // If section/semester changed for a student, run auto-enroll
            if (user.role === 'Student' && (section !== oldSection || semester !== oldSemester)) {
                await autoEnrollStudent(user._id, user.section, user.semester);
            }

            res.json({ message: 'User updated successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset user device binding
// @route   PUT /api/admin/user/:id/reset-device
// @access  Private/Admin
exports.resetDevice = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.deviceId = null;
            await user.save();
            res.json({ message: 'Device binding reset successful' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
