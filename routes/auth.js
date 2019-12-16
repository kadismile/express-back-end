const express = require('express');
const router = express.Router();
const {
  registerUser, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controllers/authController');

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;