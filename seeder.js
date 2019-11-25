const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv').config();

//Load Models
const Bootcamp = require('./models/Bootcamp');

//connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//import Data into Db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported Successfully".green.inverse)
    process.exit();
  } catch (e) {
    console.log("Error ", e)
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data Deleted Successfully".red.inverse)
    process.exit();
  } catch (e) {
    console.log("Error ", e)
  }
};

if (process.argv[2] === '-i') {
  importData();
} else {
  deleteData();
}