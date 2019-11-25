const NodeGeocoder = require('node-geocoder');
const options = {
  provider: process.env.PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);

module.exports = geocoder;