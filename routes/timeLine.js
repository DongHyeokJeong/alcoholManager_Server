"use strict";

var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');

let timeLineSchema = new mongoose.Schema({
    TODAY: {type: String},
    TOKEN: {type: String},
    TIMELINE_DATA: {
        TIME: {type: String},
        KIND: {type: String},
        SHOT: {type: String},
        STICKER: {type: [Number]}
    }
});

let timeLineModel = mongoose.model('TIMELINE_COL',timeLineSchema, 'TIMELINE_COL');


//***************************router 사용*******************************//


router.post('/', routerTimeLineAdd);    //timeine 등록
router.get('/',routerTimeLineShow);     //timeline 보기

//********************** router 내 사용함수 정의***************************//
// 1.timeline Data등록함수
function routerTimeLineAdd(req, res, next) {
    let kind = req.fields.kind;
    let shot = req.fields.shot;
    let time = req.fields.time;

    timeLineModel.timeLineAdd(kind, shot, time, function(err, result){
        if(err){
            res.json({ msg:"timeline register fail"});
            console.log('타임라인 등록 실패');
            console.log(err);
        }
        else{
            res.json({ msg: 'timeline register success', data : result});
            console.log('타임라인 등록 성공');
        }
    })

}


timeLineModel.timeLineAdd = function(kind, shot, time, callback){
    const timeLineData = {
        TIMELINE_DATA: {
            TIME: time,
            KIND: kind,
            SHOT: shot
        }
    };

    timeLineModel.create(timeLineData, function(err, result){
        if (err) {
            callback(new Error('타임라인 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};

// 2.timeline Data 보기함수
function routerTimeLineShow(req, res, next){
    //let token = req.fileds.token; 이건 아직
    timeLineModel.find({}, function(err, result){
        if(err){
            res.json({ msg:"timeline show fail"});
            console.log('타임라인 불러오기 실패');
            console.log(err);
        }
        else{
            res.json({ msg: 'timeline show success', data : result});
            console.log('타임라인 불러오기 성공');
        }
    });
}



module.exports = router;

