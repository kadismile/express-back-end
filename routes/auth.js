const express = require('express');
const router = express.Router();
const {
  registerUser, login, getMe} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;