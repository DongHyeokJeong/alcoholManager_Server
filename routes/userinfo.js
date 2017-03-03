"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const firebase = require('../firebase/firebaseConfig');
const usersModel = require('./login/login.server.model.js');

//***************************router 사용*******************************//
/* 사용자 개인정보 보여주기 */
router.get('/', routerUserinfoShow);
/* 사용자 개인정보 수정하기 */
router.put('/', routerUserinfoChange);
//********************** router 내 사용함수 정의***************************//
//user Data 보여주는 함수
function routerUserinfoShow(req, res, next) {
    let usertoken = req.headers['usertoken'];

    firebase.auth().verifyIdToken(usertoken).then(function (decodedToken) {
        var uid = decodedToken.uid;

        usersModel.find(uid, function (err, result) {
            if (err) {
                res.json({msg: "user show fail"});
                console.log('유저 검색 실패');
                console.log(err);
            }
            else {
                res.json({ username: result[0].USERNAME,
                    weight : result[0].WEIGHT,
                    sex : result[0].SEX,
                    capacity : result[0].CAPACITY});

                console.log('유저 검색 성공');
            }
        })
    }).catch(function (error) {
        console.log(error);
    });
}

//user Data 바꾸는 함수
function routerUserinfoChange(req, res, next) {
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;
    let usertoken = req.body.usertoken;

    firebase.auth().verifyIdToken(usertoken).then(function (decodedToken) {
        var uid = decodedToken.uid;

        usersModel.usersChange(uid, username, weight,sex,capacity, function (err,result) {
            if (err) {
                res.json({msg: "user update fail"});
                console.log('유저 수정 실패');
                console.log(err);
            }
            else {
                console.log('유저 수정 성공');
                res.json({ username: result.USERNAME,
                    weight : result.WEIGHT,
                    sex : result.SEX,
                    capacity : result.CAPACITY});
            }
        }).catch(function (error) {
            // Handle error
        });
    })
}



/*  유저 탐색, 유저 정보 변경 함수들   */

usersModel.usersCheck = function(findCondition, callback){
    usersModel.find(findCondition, function(err, result){
        if (err) {
            callback(new Error('유저 검색 실패'));
        } else {
            callback(null, result);
        }
    });
}

usersModel.usersChange = function(uid, username, weight,sex,capacity, callback){
    usersModel.findOne({USERTOKEN:uid}).exec(function(err, doc){
        if (err) {
            callback(new Error('유저 수정 실패'));
        } else {
            doc.set('USERNAME',username);
            doc.set('WEIGHT',weight);
            doc.set('SEX',sex);
            doc.set('CAPACITY',capacity);

            doc.save(function (err) {
                usersModel.findOne({USERTOKEN:uid}).exec(function(err, doc){
                    callback(null, doc);
                });
            });
        }
    });
}

module.exports = router;