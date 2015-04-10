// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================
    
// config files
//var db = require('./config/db');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://cordovanotification:34koekoek889@ds061671.mongolab.com:61671/cordova-notification');
mongoose.set('debug', true);

// load models
var User = require('./app/models/user');

// set our port
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
//app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
//app.use(express.static(__dirname + '/public')); 

// routes ==================================================
//require('./app/routes')(app); // configure our routes

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
/*
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
*/

router.route('/users')
	.post(function(req, res) {
		
		var user = new User();
		user.name = req.body.name;
						
		user.save(function(err) {
			if(err)
				res.send(err);
				
			res.json({ message: 'User created!'});
		})	
	})
	
	.get(function(req, res) {
		User.find(function(err, users) {
			if(err) 
				res.send(err);
				
			res.json(users);
		})
	});
	
router.route('/user/:user_id')
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err)
				res.send(err);
				
			res.json(user);
		})
	})
	
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err) 
				res.send(err)
				
			user.name = req.body.name;
			
			user.save(function(err) {
				if(err)
					res. send(err);
					
				res.json({ message: 'User updated' });
			})
		})
	});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);



// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;      