var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json('hitting home route');
});

module.exports = router;
