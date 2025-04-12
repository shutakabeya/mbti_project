const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: String,
  mbti: String,
  matches: [String],
  website: String,
  scores: {
    type: Map,
    of: Number
  }
});

module.exports = mongoose.model('Company', CompanySchema); 