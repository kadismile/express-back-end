const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp');

//@desc    Get all bootcamps
//route    GET  /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query;
  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  //creates a query String
  let queryStr = JSON.stringify(reqQuery);
  //creates operators ($gt, $gte, $lt, $lte)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //finding the resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt');
  }

  //pargination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit; //
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);


  const bootcamps = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0 ) {
    pagination.prev = {
      page: page -1,
      limit
    };
  }
  res.status(200).json({
    success: true, 
    count: bootcamps.length,
    pagination,
    data: bootcamps
  })
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse (`Bootcamp not found with id of ${req.params.id}`, 404));
    }
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