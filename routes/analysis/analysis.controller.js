"use strict";
const express = require('express');
const router = express.Router();
//const firebase = require('../../firebase/firebaseConfig');
const analysisModel = require('./analysis.model');
const timeLineModel = require('../timeline/timeLine.model');
require('date-utils');

//오늘의 음주량 측정 후 뿌려주기
exports.analysisDrinkHistoryToday = function (req, res, next) {
    let time = new Date();
    let curTime = time.toFormat('YYYY-MM-DD HH24:MI:SS');
    console.log(curTime);
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();

    if (hours < 12) {
        date -= 1;
    }
    let calTimeStart = year + "-" + month + "-" + date + " 12:00";
    let calTimeEnd = year + "-" + month + "-" + (date + 1) + " 11:59";


    let uid = req.headers['uid'];
    timeLineModel.find(

    {"UID":uid},
        {"TIMELINE_DATA": {
            $elemMatch: {"ALCOLID": {$gte: 0, $lte: 1}}
        }
        // "TIMELINE_DATA": {
        //     $elemMatch: {"TIME": {$gte: calTimeStart, $lte: calTimeEnd}}
        // }
        //"TIMELINE_DATA.ALCOLID": {$gte: 0}

        },
        function (err, result) {
    if (err) {
    }
    else {
        res.json({ result});
    }
}
)
;


}
;


