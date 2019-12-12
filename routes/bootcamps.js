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

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
  .get(getBootcamsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/test')
  .get(getTest);


module.exports = router;