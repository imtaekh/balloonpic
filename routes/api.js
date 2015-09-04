var express = require('express');
var router = express.Router();

router.route('/me')
  .get(function (req, res) {
    res.json({success:true, data:req.decoded});
  });

module.exports = router;
