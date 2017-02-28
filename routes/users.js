var express = require('express');
var router = express.Router();
var firebase = require("firebase");

firebase.initializeApp({
    serviceAccount: "./serviceAccountCredentials.json",
    databaseURL: "https://achohol-manager.firebaseio.com/"
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('users');
});

router.post('/', function(req, res, next) {
    console.log(req.body.uid);
});

module.exports = router;
