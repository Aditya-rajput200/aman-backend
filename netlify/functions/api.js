const dotenv = require('dotenv');
const serverless = require('serverless-http');

dotenv.config();

const app = require('../../app');

module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/api'
});
