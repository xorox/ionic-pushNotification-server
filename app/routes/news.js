// routes/news.js

var mongoose = require('mongoose');
//var User = mongoose.model('User');

// iOS APN Client
var News = mongoose.model('News');
var apn = require('apn');
var _ = require('lodash');

// Android GCM Client
var gcm = require('android-gcm');

module.exports = function (app) {
  'use strict';

  var router = app.get('router');

  router.get('/news', function (req, res) {
    News.find().sort({createdAt: -1}).lean().exec(function (err, news) {
      if (err) {
        return res.json({error: err});
      }

      res.json({error: null, news: news});
    });
  });

  router.get('/news/:id', function (req, res) {
    var id = req.params.id;
    News.findById(id).lean().exec(function (err, news) {
      if (err) {
        return res.json({error: err});
      } else {
        return res.json({error: "User doesn't exist!", user: null});
      }

      res.json({error: null, news: news});
    });
  });

  router.post('/news', function (req, res) {
    var username = req.body.username;
    var text = req.body.text;

    var news = new News({
      username: username,
      text: text
    });

    news.save(function (err, news) {
      process.nextTick(function () {
        User.find({deviceRegistered: true}).lean().exec(function (err, users) {
          if (!err) {
            for (var i = 0; i < users.length; i++) {
              if(users[i].deviceToken.length < 70) {
                sendPushiOS(users[i], news);
              } else {
                sendPushAndroid(users[i], news);
              }
            }
          }
        });
      });
      res.redirect('/add-news');
    });
  });

  function sendPushiOS(user, news) {
    var text = news.text.substr(0, 100);

    var device = new apn.Device(user.deviceToken);
    var note = new apn.Notification();
    note.badge = 1;
    note.contentAvailable = 1;
    note.alert = {
      body : text
    };
    note.device = device;

    var options = {
      gateway: 'gateway.sandbox.push.apple.com',
      errorCallback: function(error){
        console.log('push error', error);
      },
      cert: 'PushNewsCert.pem',
      key:  'PushNewsKey.pem',
      passphrase: 'superpass',
      port: 2195,
      enhanced: true,
      cacheLength: 100
    };
    var apnsConnection = new apn.Connection(options);
    console.log('push sent to ', user.username);
    apnsConnection.sendNotification(note);

  }

  function sendPushAndroid(user, news) {
    var gcmObject = new gcm.AndroidGcm('AIzaSyBXWKjEbzCfAersPzodMQrhDWguB5J5O7g');

    var registration_ids = Array();
    registration_ids.push(users.deviceToken);

    var message = new gcm.Message({
        registration_ids: registration_ids,
        data: {
            key1: news
        }
    });

    gcmObject.send(message, function(err, response) {
      if(err)
        console.log(err+' '+response);

      console.log(response);
    });

  }
};
