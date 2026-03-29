const express = require('express');
const router = express.Router();
const { 
    createSubject, 
    getSubjects, 
    enrollStudents,
    syncAllEnrollments // Added
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Admin'), createSubject);
router.get('/', authorize('Admin', 'Faculty', 'Student'), getSubjects);
router.post('/sync', authorize('Admin'), syncAllEnrollments); // Added
router.put('/:id/enroll', authorize('Admin', 'Faculty'), enrollStudents);

module.exports = router;
