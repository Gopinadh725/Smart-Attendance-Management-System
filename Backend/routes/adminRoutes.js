const express = require('express');
const router = express.Router();
const { 
    getUsers, 
    createUser,
    updateUser, // Updated
    resetDevice, 
    deleteUser 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are restricted to Admin
router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getUsers);
router.post('/user', createUser);
router.put('/user/:id', updateUser); // Updated
router.put('/user/:id/reset-device', resetDevice);
router.delete('/user/:id', deleteUser);

module.exports = router;
