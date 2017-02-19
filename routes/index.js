var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http');
var app = express();
var server = http.createServer(app);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
    //require(path.join(__dirname, '../app/', 'socket.js'))(server);
    res.sendFile(path.join(__dirname, '../routes/', 'clienttest.html'));
    console.log('res.send다음 ');
});


module.exports = router;
