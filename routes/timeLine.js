"use strict";

var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');

let timeLineSchema = new mongoose.Schema({
    TODAY: {type: String},
    USERTOKEN: {type: String},
    USERNAME: {type: String},
    TIMELINE_DATA: [{
        TIME: {type: String},
        ALCOLID: {type: Number},
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
router.put('/sticker', routerTimeLineAddSticker);     //timeline sticker 붙이기
router.put('/sticker', routerTimeLineDeleteSticker);     //timeline sticker 삭제하기
router.post('/sync', routerTimeLineSync);     //timeline data 안드와 동기화

//********************** router 내 사용함수 정의***************************//
//1. timeLine 객체 만들기
function routerTimeLineObjectAdd(req, res, next) {
    let username = req.body.username;
    let usertoken = req.body.usertoken;

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

timeLineModel.timeLineObjectAdd = function (username, usertoken, callback) {
    const timeLineObjectData = {
        USERNAME: username,
        USERTOKEN: usertoken,
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
    let usertoken = req.body.usertoken;
    let time = req.body.time;
    let alcolId = req.body.alcolid;
    let shot = req.body.shot;

    timeLineModel.timeLineAdd(usertoken, time, alcolId, shot, function (err, result) {
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


timeLineModel.timeLineAdd = function (usertoken, time, alcolId, shot, callback) {
    const timeLineData = {
        TIME: time,
        ALCOLID: alcolid,
        SHOT: shot
    };


    timeLineModel.update({USERTOKEN: usertoken}, {'$push': {'TIMELINE_DATA': timeLineData}}, function (err, result) {
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
    let usertoken = req.headers['usertoken'];
    //let today = req,body.today;이건 아직
    timeLineModel.find({USERTOKEN: usertoken}, function (err, result) {
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

//4. timeline sticker 추가하기
function routerTimeLineAddSticker(req, res, next) {

    let timelineid = req.body.timelineid;
    let usertoken = req.body.usertoken;
    let sticker = req.body.sticker;

    timeLineModel.timeLineAddSticker(timelineid, usertoken, sticker, function (err, result) {
        if (err) {
            res.json({msg: "timeline sticker register fail"});
            console.log('타임라인 스티커 등록 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline sticker register success', data: result});
            console.log('타임라인 스티커 등록 성공');
        }
    });
}

timeLineModel.timeLineAddSticker = function (timelineid, usertoken, sticker, callback) {
    timeLineModel.update(
        //{"TIMELINE_DATA": {$elemMatch: {"_id": ObjectId(timelineid)}}},
        {"TIMELINE_DATA": {$elemMatch: {"_id": timelineid}}},
        {$push: {"TIMELINE_DATA.$.STICKER": sticker}},
        function (err, result) {
            if (err) {
                callback(new Error('타임라인 스티커 등록 실패'));
            }
            else {
                callback(null, result);
            }
        }
    );
};

//5. timeline sticker 삭제하기
function routerTimeLineDeleteSticker(req, res, next) {

    let timelineid = req.body.timelineid;
    let usertoken = req.body.usertoken;
    let sticker = req.body.sticker;

    timeLineModel.timeLineDeleteSticker(timelineid, usertoken, sticker, function (err, result) {
        if (err) {
            res.json({msg: "timeline sticker delete fail"});
            console.log('타임라인 스티커 삭제 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline sticker delete success', data: result});
            console.log('타임라인 스티커 삭제 성공');
        }
    });
}

timeLineModel.timeLineDeleteSticker = function (timelineid, usertoken, sticker, callback) {
    timeLineModel.update(
        {"TIMELINE_DATA": {$elemMatch: {"_id": timelineid}}},
        {$pull: {"TIMELINE_DATA.$.STICKER": sticker}},
        function (err, result) {
            if (err) {
                callback(new Error('타임라인 스티커 등록 실패'));
            }
            else {
                callback(null, result);
            }
        }
    );
};

//6. timeline data 안드와 동기화
function routerTimeLineSync(req, res, next) {
    let userToken = req.headers['usertoken'];
    let timeLine = req.body.timeline;

    timeLineModel.timeLineSync(userToken, timeLine, function (err, result) {
        if (err) {
            res.json({msg: "timeline sync fail"});
            console.log('타임라인 동기화 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline sync success', data: result});
            console.log('타임라인 동기화 성공');
        }
    });
};

timeLineModel.timeLineSync = function (userToken, timeLine, callback) {

    timeLineModel.update({USERTOKEN: userToken}, {'$push': {'TIMELINE_DATA': timeLine}}, function (err, result) {
        if (err) {
            callback(new Error('타임라인 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};


module.exports = router;

