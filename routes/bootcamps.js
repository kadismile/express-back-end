const express = require('express');
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcamsInRadius, bootcampPhotoUpload,getTest} = require('../controllers/bootcampController');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

//include Other resource routers
const courseRouter = require('./courses');

const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
  .get(getBootcamsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/test')
  .get(getTest);


module.exports = router;