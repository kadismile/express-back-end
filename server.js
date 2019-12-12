const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config();
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/errors')
const connectDb = require('./config/db')

//ROUTE FILES
let { courses, bootcamps, tests, auth } = require('./routes/');

connectDb();

const app = express();

//Body parser
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// file upload
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/test', tests);
app.use('/api/v1/auth', auth);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, 
  console.log(`SERVER RUNNIN IN ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold)
)
//Handle unhandled rejections
process.on('unhandledRejection', (err, promise)=> {
  console.log(`Error: ${err.message}`.red)
  //close the server and exit process
  server.close(() => process.exit(1))
})