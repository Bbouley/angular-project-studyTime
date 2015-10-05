var express = require('express');
var router = express.Router();
var path = require('path');

// router.get('/', function(req, res, next) {
//   res.sendFile('./views/index.html');
// });

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'index.html'));
});

router.get('/user', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'user.html'));
});

router.get('/resources', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'resources.html'));
});




module.exports = router;
