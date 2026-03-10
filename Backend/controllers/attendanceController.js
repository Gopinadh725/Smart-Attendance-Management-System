const Attendance = require('../models/Attendance');
const crypto = require('crypto'); // Built-in Node.js module for security

// 1. Generate QR Code Session
exports.generateQR = async (req, res) => {
    try {
        const { subjectId } = req.body;
        const facultyId = req.user.id;

        // Check for an existing session for this subject today
        let session = await Attendance.findOne({
            subject: subjectId,
            faculty: facultyId,
            date: { $gte: new Date().setHours(0,0,0,0) }
        });

        if (!session) {
            // Create new session if none exists
            session = new Attendance({
                subject: subjectId,
                faculty: facultyId,
                qrCodeConfig: { attempts: 0 }
            });
        }

        // Check the 5-attempt limit as per abstract 
        if (session.qrCodeConfig.attempts >= 5) {
            return res.status(403).json({ message: "Maximum QR generation attempts (5) reached for this session." });
        }

        // Generate a random secure token and set expiration (e.g., 60 seconds)
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 60 * 1000); // 1 minute limit 

        session.qrCodeConfig.token = newToken;
        session.qrCodeConfig.expiresAt = expiration;
        session.qrCodeConfig.attempts += 1;

        await session.save();

        // Send token to frontend (Frontend will convert this string into a QR image)
        res.status(200).json({ 
            token: newToken, 
            expiresAt: expiration,
            attemptsLeft: 5 - session.qrCodeConfig.attempts 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.scanQR = async (req, res) => {
    try {
        const { token } = req.body;
        const studentId = req.user.id;

        // Find the active session with this token
        const session = await Attendance.findOne({
            "qrCodeConfig.token": token,
            "qrCodeConfig.expiresAt": { $gt: new Date() } // Must not be expired 
        });

        if (!session) {
            return res.status(400).json({ message: "Invalid or Expired QR Code" });
        }

        // Check if student is already marked present
        const alreadyPresent = session.presentStudents.find(
            (s) => s.studentId.toString() === studentId
        );

        if (alreadyPresent) {
            return res.status(400).json({ message: "Attendance already recorded" });
        }

        // Add student to present list
        session.presentStudents.push({ studentId });
        await session.save();

        res.status(200).json({ message: "Attendance marked successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};