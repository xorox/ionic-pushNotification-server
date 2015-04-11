// app/models/users.js
// grab the mongoose module
var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    username: {type: String, unique: true},
    deviceToken: {type: String, unique: true},
    deviceRegistered: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', UserSchema);
