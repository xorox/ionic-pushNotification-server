// routes/user.js

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {
  'use strict'

  var router = app.get('router');

  router.post('/user', function(req, res) {
    var username = req.body.username;

    var user = new User();
    user.username = username;

    user.save(function(err) {
      if(err)
        return res.json({error: err});

      res.json({message: 'User '+username+' created!'});
    })
  });

  router.get('/users', function(req, res) {
    User.find(function(err, users) {
      if(err)
        return res.json({error: err});

      return res.json({users: users});
    })
  });

  router.post('/user/login', function(req, res) {
    var username = req.body.username;

    User.findOne({username: username}).lean().exec(function(err, user) {
      if(err) {
        return res.json({error: err});
      }

      if (user) {
        return res.json({error: null, user: user});
      }
    });

    router.put('/user/registerDevice', function(req, res) {
      var user = req.body.user;
      var token = req.body.token;

      User.findByIdAndUpdate(user._id, {
        $set: {
          deviceToken: token,
          deviceRegistered: true
        }
      }).lean().exec(function(err, user) {
        //if(err || user) {
        //  return res.json({error: err});
        //}

        res.json({error: err, user: user});
      });

    });
  });
}
