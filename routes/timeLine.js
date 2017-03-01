"use strict";

var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');

let timeLineSchema = new mongoose.Schema({
    TODAY: {type: String},
    USERTOKEN: {type: String},
    USERNAME : {type: String},
    TIMELINE_DATA: [{
        TIME: {type: String},
        KIND: {type: String},
        SHOT: {type: Number},
        STICKER: {type: [Number]}
    }
    ]
});

let timeLineModel = mongoose.model('TIMELINE_COL', timeLineSchema, 'TIMELINE_COL');


//***************************routetr 사용*******************************//

router.post('/object', routerTimeLineObjectAdd);    //timeine 객체 만들기
router.post('/', routerTimeLineAdd);    //timeine 등록
router.get('/', routerTimeLineShow);     //timeline 보기

//********************** router 내 사용함수 정의***************************//
//1. timeLine 객체 만들기
function routerTimeLineObjectAdd(req, res, next) {
    let usertoken = req.fields.usertoken;
    let username = req.fields.username;

    timeLineModel.timeLineObjectAdd(username, usertoken, function (err, result) {
        if (err) {
            res.json({msg: "timelineObject register fail"});
            console.log('타임라인 객체 등록 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timelineObject register success', data: result});
            console.log('타임라인 객체 등록 성공');
        }
    });
}

timeLineModel.timeLineObjectAdd = function(usertoken, callback){
    const timeLineObjectData = {
        USERTOKEN: usertoken,
        USERNAME : username,
        TMIELINE_DATA: []
    };

    timeLineModel.create(timeLineObjectData, function (err, result) {
        if (err) {
            callback(new Error('타임라인 객체 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};


// 2.timeline Data등록함수
function routerTimeLineAdd(req, res, next) {
    let usertoken  = req.fields.usertoken;
    let kind = req.fields.kind;
    let shot = req.fields.shot;
    let time = req.fields.time;

    timeLineModel.timeLineAdd(usertoken, kind, shot, time, function (err, result) {
        if (err) {
            res.json({msg: "timeline register fail"});
            console.log('타임라인 등록 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline register success', data: result});
            console.log('타임라인 등록 성공');
        }
    })

}


timeLineModel.timeLineAdd = function (usertoken, kind, shot, time, callback) {
    const timeLineData = {
            TIME: time,
            KIND: kind,
            SHOT: shot
    };


    timeLineModel.update({USERTOKEN: usertoken},{'$push':{'TIMELINE_DATA' : timeLineData}}, function (err, result) {
        if (err) {
            callback(new Error('타임라인 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};

// 3.timeline Data 보기함수
function routerTimeLineShow(req, res, next) {
    //let usertoken = req.param('usertoken');
    let usertoken = req.fields.usertoken;
    //let today = req,fields.today;이건 아직
    timeLineModel.find({USERTOKEN : usertoken}, function (err, result) {
        if (err) {
            res.json({msg: "timeline show fail"});
            console.log('타임라인 불러오기 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline show success', data: result});
            console.log('타임라인 불러오기 성공');
            console.log(usertoken);
        }
    })
}


module.exports = router;

