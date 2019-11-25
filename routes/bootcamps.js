const express = require('express');
const router = express.Router();
const {
getBootcamp,
getBootcamps,
createBootcamp,
deleteBootcamp,
updateBootcamp,
getBootcamsInRadius} = require('../controllers/bootcampController');


router.route('/radius/:zipcode/:distance')
  .get(getBootcamsInRadius);

router.route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);


module.exports = router;