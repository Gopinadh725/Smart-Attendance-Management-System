const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Faculty can generate QR codes [cite: 11, 14]
router.post('/generate', protect, authorize('Faculty'), generateQR);


// Only Students can scan QR codes [cite: 11]
router.post('/scan', protect, authorize('Student'), scanQR);

module.exports = router;