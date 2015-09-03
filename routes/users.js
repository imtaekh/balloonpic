var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.route('/')
  .get(function (req, res) {
    User.find({},function (err,users) {
      if(err) return res.json({success:false, message:err.message});
      res.json({success:true, data:users});
    });
  })
  .post(function (req, res) {
    User.create(req.body,function (err,user) {
      if(err) return res.json({success:false, message:err.message});
      res.json({success:true, data:user});
    });
  });

router.route('/:id')
  .get(function (req, res) {
    User.findOne({_id:req.params.id},function (err,user) {
      if(err) return res.json({success:false, message:err.message});
      res.json({success:true, data:user});
    });
  })
  .patch(function (req, res) {
    User.findOneAndUpdate({_id:req.params.id},req.body,function (err,user) {
      if(err) return res.json({success:false, message:err.message});
      res.json({success:true, data:{id:req.params.id}});
    });
  })
  .delete(function (req, res) {
    User.findOneAndRemove({_id:req.params.id},function (err,user) {
      if(err) return res.json({success:false, message:err.message});
      res.json({success:true, data:{id:req.params.id}});
    });
  });

module.exports = router;
