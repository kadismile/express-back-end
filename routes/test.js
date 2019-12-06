const express = require('express');
const router = express.Router();
const {
  getTest
} = require('../controllers/bootcampController');

router.route('/')
  .post(getTest);

module.exports = router;