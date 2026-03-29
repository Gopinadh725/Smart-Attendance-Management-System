const express = require('express');
const router = express.Router();
const { generateQR, scanQR } = require('../controllers/qrController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', authorize('Faculty'), generateQR);
router.post('/scan', authorize('Student'), scanQR);

module.exports = router;
