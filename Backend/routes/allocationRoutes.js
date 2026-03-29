const express = require('express');
const router = express.Router();
const { createAllocation, getAllocations, deleteAllocation, updateAllocation } = require('../controllers/allocationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Admin'), createAllocation);
router.get('/', authorize('Admin', 'Faculty'), getAllocations);
router.put('/:id', authorize('Admin'), updateAllocation);
router.delete('/:id', authorize('Admin'), deleteAllocation);

module.exports = router;
