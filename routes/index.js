var appConfig = require('../config/app_config');

var express = require('express');
var passport= require('passport');
var jwt     = require('jsonwebtoken');
var router  = express.Router();

router.get('/',function (req, res) {
  res.send("hi");
});

router.get('/loginFailed',function (req, res) {
  res.json({success:false, message:"login failed"});
});

router.get('/auth/instagram',
  passport.authenticate('instagram'));

router.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/loginFailed' }),
  function(req, res) {
    var token = jwt.sign({
      id: req.user._id,
      instagramId: req.user.instagramId,
      username: req.user.username,
      accessToken: req.user.accessToken
    }, appConfig.secret,  {
      expiresInMinutes: 1440 // expires in 24 hours
    });

    res.json({success:true, token:token});
  });

module.exports = router;
