/**
 * Created by 양인호꺼 on 2017-02-19.
 */
"use strict";
const socket = require('socket.io');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*const userInfoSchema = mongoose.Schema({
    NAME: String,
    WEIGHT: Number,
    SEX: String,
    TODAY: Number
});

const timelineModel = mongoose.model('TIMELINE_COL', timelineSchema, 'TIMELINE_COL');
const userInfoModel = mongoose.model('USER_COL', userInfoSchema, 'USER_COL');
 */
module.exports = function (server) {
    var io = socket(server);

    io.on('connection', function (socket) {
        console.log('socket connected ');
        console.log('datavbase 일단 연결하고');
       /* timelineModel.create({TODAY: "hhhhjhi"}, function (err, data) {
            if (err) {
                console.log('데이터 입력은?')
            }
            else {
                console.log('이건 성공' + data);
            }
        });
        */

        timelineModel.find(function (err, data) {
            if (err) {
                console.log('디비 연결 실패');
            }
            else {
                console.log(data);
            }
        });

        socket.on('send timeline data', function () {
            console.log('send timeline data 이벤트 발생');
            console.log(timelineModel.find());
            //curTime, kind, shot 데이터 받아오고
            //디비에 저장하고
            //
            io.to(socket.id).emit('receive timeline data', msg)
        });


        socket.on('disconnect', function () {
            console.log('user disconnected: ', socket.id);
        });

        socket.on('send message', function (name, text) {
            var msg = name + ' : ' + text;
            console.log(msg);
            io.emit('receive message', msg);
        });

        socket.on('personal info', function (msg) {
            let userInfo = new userInfoModel(msg);
            userInfo.save(function (err,results,numAffected) {
                console.log(results, numAffected);
            });
        });
    });
}


