const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp');

//@desc    Get all bootcamps
//route    GET  /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {


  res.status(200).json(res.advancedResults)
});

//@desc    Get a bootcamp
//route    GET  /api/v1/bootcamp/:id
//@access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
      return next(new ErrorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true, 
      data: bootcamp
    })
});

//@desc    Create new bootcamp
//route    POST  /api/v1/bootcamp/create//@access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  })
 
});

//@desc    Update new bootcamp
//route    PUT  /api/v1/bootcamp/update/:id
//@access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return next(new ErrorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(201).json({ success: true, data: bootcamp })
})

//@desc    Delete a bootcamp
//route    DELETE  /api/v1/bootcamp/update/:id
//@access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    await bootcamp.remove();

    res.status(201).json({ success: true, data: {} })
});

//@desc    Get  bootcamps within a radius
//route    GET  /api/v1/bootcamp/radius/:zipcode/:distance
//@access  Private
exports.getBootcamsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  console.log("REQUEST_PARAMS ", zipcode, distance);

  //Get lat long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //cal radius using radius
  //diviide dis by radius by radius of earth
  //Earth Radius = 3,963  /
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius ] } }
  });

  res.status(201).json({
    count: bootcamps.length,
    success: true,
    data: bootcamps
  })

});

//@desc    Get a bootcamp
//route    PUT  /api/v1/bootcamp/:id/photo
//@access  Public
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse (`Please Upload a file`, 404));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse (`Please Upload an image file`, 404));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse (`Please upload an image less than
    ${process.env.MAX_FILE_UPLOAD}`, 404));
  }

  //create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse (`Error Uploading Photo`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    })
  });


});

exports.getTest = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    name: "ibrahim",
    age: 40,
  })
});