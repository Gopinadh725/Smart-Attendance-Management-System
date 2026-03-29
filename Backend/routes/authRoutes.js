const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    forgotPassword, 
    resetPassword, 
    getProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Private routes
router.get('/profile', protect, getProfile);

module.exports = router;