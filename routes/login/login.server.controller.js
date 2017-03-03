"use strict";
const express = require('express');
const router = express.Router();
const firebase = require('../../firebase/firebaseConfig');
const usersModel = require('./login.server.model.js');

/*1)게스트로 로그인하기*/
exports.loginAsGuest = function(req, res, next) {
    let usertoken = req.body.usertoken;
    //기본 정보
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;
    let firebase_uid;

    let findConditionLocalUser = {
        firebase_uid: firebase_uid
    }

    firebase.auth().verifyIdToken(usertoken).then(function(decodedToken) { //UID 인증
        firebase_uid = decodedToken.uid;

        usersModel.find(findConditionLocalUser, function (err, user) {
            if (err) {
                res.json({msg: "user show fail"});
                console.log('유저 검색 실패');
                console.log(err);
            }
            else if(!user) {
                usersModel.guestUsersAdd(firebase_uid, username, weight,sex,capacity, function(err, result){
                    if(err){
                        res.json({ msg:"게스트 유저 등록 실패"});
                        console.log('게스트 유저 등록 실패');
                        console.log(err);
                    }
                    else{
                        res.json({ msg: '게스트 유저 등록 성공', data : result}); // 토큰들어있음
                        console.log('게스트 유저 등록 성공');
                    }
                })
            }
            else if(user) {
                res.json({ msg: '게스트 유저로 로그인'});
            }
        })
    }).catch(function(error) {
        console.log(error);
    });
}


/* 2) 페이스북 로그인 */
exports.loginAsFacebook = function(req, res, next) {
    let usertoken = req.body.usertoken;
    //기본 정보
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;

}



/*  유저 생성, 유저 탐색, 유저 정보 변경 함수들   */
usersModel.guestUsersAdd = function(firebase_uid, username, weight, sex, capacity, callback){
    //맞춤 토큰생성
    var uid = "12345";
    var customToken = firebase.auth().createCustomToken(uid);

    const userData = {
        FIREBASE_UID: firebase_uid,
        USERNAME: username,
        WEIGHT: weight,
        SEX: sex,
        CAPACITY: capacity,
        CUMTOMTOKEN: customToken
    };

    usersModel.create(userData, function(err, result){
        if (err) {
            callback(new Error('유저 등록 실패'));
        }
        else {
            callback(null, result);
        }
    });
};