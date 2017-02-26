var express = require('express');
var router = express.Router();
var path = require('path');


/* GET home page. */

router.get('/a', function(req, res, next) {
    console.log('ㅅㅂ');
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../routes/', 'clienttest.html'));
    console.log('res.send다음 ');
});


module.exports = router;
