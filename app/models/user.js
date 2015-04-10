// app/models/users.js
// grab the mongoose module
var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('User', UserSchema);

// define our users model
// module.exports allows us to pass this to other files when it is called
/*
module.exports = mongoose.model('User', {
    username : {type : String, default: ''},
    password : {type : String, default: ''}
});
*/