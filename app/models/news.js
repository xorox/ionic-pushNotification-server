// models/news.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema   = new Schema({
  username: String,
  text: String,
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('News', NewsSchema);
