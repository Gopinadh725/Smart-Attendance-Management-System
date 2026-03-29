const express = require('express');
const router = express.Router();
const { exportToExcel, exportToPDF, getReportData } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/data/:subjectId', protect, authorize('Admin', 'Faculty', 'Student'), getReportData);
router.get('/export/excel/:subjectId', protect, authorize('Faculty', 'Admin'), exportToExcel);
router.get('/export/pdf/:subjectId', protect, authorize('Faculty', 'Admin'), exportToPDF);

module.exports = router;