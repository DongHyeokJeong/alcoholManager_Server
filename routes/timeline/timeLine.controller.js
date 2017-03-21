"use strict";
const express = require('express');
const router = express.Router();
const firebase = require('../../firebase/firebaseConfig');
const timeLineModel = require('./timeLine.model.js');


//1. timeLine 객체 만들기
exports.routerTimeLineObjectAdd = function (req, res, next) {
    let username = req.body.username;
    let uid = req.body.uid;

    timeLineModel.timeLineObjectAdd(username, uid, function (err, result) {
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

timeLineModel.timeLineObjectAdd = function (username, uid, callback) {
    const timeLineObjectData = {
        USERNAME: username,
        UID: uid,
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
exports.routerTimeLineAdd = function (req, res, next) {
    let uid = req.body.uid;
    let time = req.body.time;
    let alcolId = req.body.alcolid;
    let shot = req.body.shot;


    timeLineModel.timeLineAdd(uid, time, alcolId, shot, function (err, result) {
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


timeLineModel.timeLineAdd = function (uid, time, alcolId, shot, callback) {
    const timeLineData = {
        TIME: time,
        ALCOLID: alcolId,
        SHOT: shot
    };
    console.log("--------------------------------");
    console.log(timeLineData);
    console.log("--------------------------------");

    timeLineModel.update({UID: uid}, {'$push': {'TIMELINE_DATA': timeLineData}}, function (err, result) {
        if (err) {
            callback(new Error('타임라인 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};

// 3.timeline Data 보기함수
exports.routerTimeLineShow = function (req, res, next) {
    //let uid = req.param('uid');
    let uid = req.headers['uid'];
    //let today = req,body.today;이건 아직
    timeLineModel.find({UID: uid}, function (err, result) {
        if (err) {
            res.json({msg: "timeline show fail"});
            console.log('타임라인 불러오기 실패');
            console.log(err);
        }
        else {
            res.json({msg: 'timeline show success', data: result});
            console.log('타임라인 불러오기 성공');
            console.log(uid);
        }
    })
}

//4. timeline sticker 추가하기
exports.routerTimeLineAddSticker = function (req, res, next) {

    let timelineid = req.body.timelineid;
    let uid = req.body.uid;
    let sticker = req.body.sticker;

    timeLineModel.timeLineAddSticker(timelineid, uid, sticker, function (err, result) {
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

timeLineModel.timeLineAddSticker = function (timelineid, uid, sticker, callback) {
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
exports.routerTimeLineDeleteSticker =function (req, res, next) {

    let timelineid = req.body.timelineid;
    let uid = req.body.uid;
    let sticker = req.body.sticker;

    timeLineModel.timeLineDeleteSticker(timelineid, uid, sticker, function (err, result) {
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

timeLineModel.timeLineDeleteSticker = function (timelineid, uid, sticker, callback) {
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
exports.routerTimeLineSync = function(req, res, next) {
    let uid = req.headers['uid'];
    let timeLine = req.body.timeline;

    console.log('--------------------------------');
    console.log(uid);
    console.log(timeLine);
    console.log('--------------------------------');


    timeLineModel.timeLineSync(uid, timeLine, function (err, result) {
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

timeLineModel.timeLineSync = function (uid, timeLine, callback) {

    timeLineModel.update({UID: uid}, {$addToSet: {'TIMELINE_DATA': {$each : timeLine}}}, function (err, result) {
        if (err) {
            callback(new Error('타임라인 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};