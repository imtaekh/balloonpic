var express = require('express');
var router = express.Router();

router.route('/me')
  .get(function (req, res) {
    console.log(req.decoded);
    res.json(req.decoded);
  });

module.exports = router;
