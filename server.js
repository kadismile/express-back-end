const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/errors')
const connectDb = require('./config/db')

//ROUTE FILES
let { books, bootcamps } = require('./routes/');
let { logger } = require('./middleware/logger');

/*dotenv.config({ path: './config/config.env' });*/
//connect to database
connectDb();

const app = express();

//Body parser
app.use(express.json())

if (process.env.NODE_ENVIRONMENT === 'development') {
  app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps);
app.use(errorHandler)




const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, 
  console.log(`SERVER RUNNIN IN ${process.env.NODE_ENVIRONMENT} mode on PORT ${PORT}`.yellow.bold)
)
//Handle unhandled rejections
process.on('unhandledRejection', (err, promise)=> {
  console.log(`Error: ${err.message}`.red)
  //close the server and exit process
  server.close(() => process.exit(1))
})