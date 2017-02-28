var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('express-formidable');
const firebase = require('firebase');

app.use(formidable());

//firebase setup
firebase.initializeApp({
    serviceAccount: {
        type: "service_account",
        project_id: "alcoholmanager-b4193",
        private_key_id: "83364ae673ffcc4822c1567131160ded57bb924f",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4o/V1+bIjeaJU\nFuyfmxmRBd9mAlIPWIJe71p8C0QlJX202NsK6TiHgz3FeJQsnFhDpnz74MNun6QE\ncqFByZYFQPLm9t9fLM3ZCTWW+fXf4f9mNThxW7K210xTfB0JV8J6jxA8IFTWW43e\nNC5CcT1ENLD7YyKiRK9kmAgvgSo+70zYIbshYx1kkHEGGQw0Fw5eFM205rdO9j2X\njUz7BhCebu86SbFJo8mQNNcpQMzPEHWwIMwlfH/Ppz5bXV5b7zgo6PPpSY2O60br\neTgjtRiPxj9GjnOrab9FJcepjFBl9pAGYpoiuYCX5uwSxT1n0RuA3qCPYf7NuEae\nrNSMJGE1AgMBAAECggEBAKTz7ZWxNoFU6D3BoTHRyZxzJ6qlhhQpmYcgxLCvC/k3\nrj9DwSTVSGhgSm5Bk/bq0jvV4DDSEyagPlKu6fuxEXKuHJNUmCgaCejMvnCb7RpP\nd/EiuMMlDdslKw4mgnZXTepaJ0HgDIrYjjymV3GKYxatEDP10/ot7Jes7xsphMll\nUYvBhHh/U5jPiFYrwosleqLloAEcMBUhCJdo3mj4ZX4fawjv8cbGOdU4EiQ/4apf\n1ktmORIdEJmiDmcvDJC2oSkmLmB1sPErXjFSPdrtPbTZlUl08Vbx0yrRHZfnX1Uf\nmMIdd3r3aU8zUo5OUdgJUnilzfuymoghel9Im1NVUCECgYEA4O31QzEBaSV/qIxM\nWNQ4h2llVD6jU5L4E0GM8IPxcrGzSQOD+YrAjZRkgh6+itMZeiNSz7LKtD0VnAot\n2wHFrim/UNlXTWSDA7uMXT4EVkrlx/U6SjeX5DQLxHxI2fVaW52QLkfvsHbmza2c\nelNPkFnKzssknNu3JWOUGtStYBkCgYEA0iVIszzMkLYRmr7/NAYyCoP2s44Omcah\nYTiHhZRgYmEI90FEJaowS5mVcE01s6BWvEIm/AFD1JgY2/q4I4XxO1RRcOhyF/q/\nJ1hXgqlNgKJsVZoVp6dWzpbq+ObNZvxSbN4CnIJGGPG8gmBPjse68Bt1b1rIlN4W\niyzfjJkavX0CgYEAi5VgJMhelb+9jv0xy9Y3FmFjjnoopQ6JgHmnWwKmbYS1O9RA\nrDVc9P9nuBAYMtJ59v/Avj+3504ZAPKYLlbVNBWYMjYOJWsAmupiWuLHkj18hzA5\nciE501YxD0gJdaj63+vRs8bUie/fnzfj6U2WDICMiPQrzmPTLhKzsErXJNECgYBr\nqX5dlcCYQy8xwLiuxp3MlV9HDnicgA8d6ABGh4X54Qze4CkxwseLc9wD9QqWRIcr\nXBjs8xj1ShcyXHkKegzlAIXY+r25W1Wjqrbq0iJKzOwDzzVY93qZzOgFLPn+0TbJ\nX9SmqnePQAn8Iaug0uMLMIYxzqkE2+Ng2lSNi8MPYQKBgDGvvoo3yJtkdqD1Nese\ntGOHMMiJQnqEV6ubbGkhA/Dfo764LG0X64ybEx05rLdM3lK8oEr9XzwT2PJUXkiR\nSFCHEHuQHJFFtLlRbTbx4yzXXwqyLwwbUspZrfxOcXeiMblPqlD16jfn6iqM/4r4\n8Vily3pb7qZX/7jM2lsm1wR6\n-----END PRIVATE KEY-----\n",
        client_email: "alcoholserver@alcoholmanager-b4193.iam.gserviceaccount.com",
        client_id: "102655635435354119959",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/alcoholserver%40alcoholmanager-b4193.iam.gserviceaccount.com"
    },
    databaseURL: "https://alcoholmanager-b4193.firebaseio.com/"
});


var index = require('./routes/index');
var users = require('./routes/users');
var timeline = require('./routes/timeLine');
//var socket = require('./app/socket');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/timeline', timeline);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;