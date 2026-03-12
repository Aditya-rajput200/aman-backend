const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String
  },
  bio: {
    type: String
  },
  photo_url: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
