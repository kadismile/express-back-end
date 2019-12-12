const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//@desc    Register User
//route    POST  /api/v1/auth/register
//@access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {

  const { name, email, password, role } = req.body;

  //creae user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //a static will be called on the User schema itself
  // and a method will be called on the user being created i.e user not User

  const token = user.getSignedJwtToken()
  res.status(200).json({
    success: true,
    token: token
  })
});

//@desc    Login User
//route    POST  /api/v1/auth/login
//@access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  //check for user
  const user = await User.findOne({ email }).select('+password'); // this is done bcos when u find a user the password is never returned
  // it was set in the User model on the password
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  const token = user.getSignedJwtToken()
  res.status(200).json({
    success: true,
    token: token
  })
});