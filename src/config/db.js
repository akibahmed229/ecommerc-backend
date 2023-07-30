const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');

const connectDatabase = async (options= {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log('MongoDB connected');

    mongoose.connection.on('error', (err) => {
      console.error(`DB connection error: ${err}`);
    });
  } catch (error) {
      console.log(`Coudn't connect to DB: ${error}`);
  }
};

module.exports = connectDatabase;
