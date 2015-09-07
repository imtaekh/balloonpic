var XMLHttpRequest= require("xhr2");
var express       = require('express');
var router        = express.Router();

router.route('/me')
  .get(function (req, res) {
    res.json({success:true, data:req.decoded});
  });
router.route('/my_ig')
  .get(function (req, res) {
    var user = req.decoded;
    getJSON("https://api.instagram.com/v1/users/"+user.instagramId+"/media/recent?count=10&access_token="+user.accessToken,
      function (data) {
        res.json({success:true, data:data.data});
      },
      function (status) {
        res.json({success:false, message:status});
      }
    );
  });

function getJSON(url, successHandler, errorHandler) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.onreadystatechange = function() {
   var status;
   var data;
   // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
   if (xhr.readyState == 4) { // `DONE`
     status = xhr.status;
     if (status == 200) {
       data = JSON.parse(xhr.responseText);
       successHandler && successHandler(data);
     } else {
       errorHandler && errorHandler(status);
     }
   }
  };
  xhr.send();
}
module.exports = router;
