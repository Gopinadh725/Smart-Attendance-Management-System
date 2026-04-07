const express = require('express');
const router = express.Router();
const { 
    markAttendance, 
    getAttendanceByDate, 
    getSubjectAnalytics, 
    getMyReport,
    getStudentStats
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/student-stats', authorize('Student'), getStudentStats);
router.post('/mark', authorize('Faculty', 'Admin'), markAttendance);
router.get('/:subjectId/:date', authorize('Faculty', 'Admin'), getAttendanceByDate);
router.get('/analytics/:subjectId', authorize('Faculty', 'Admin', 'Student'), getSubjectAnalytics);
router.get('/my-report', authorize('Student'), getMyReport);

module.exports = router;