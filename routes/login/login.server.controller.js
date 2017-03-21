"use strict";
const express = require('express');
const router = express.Router();
let FB = require('fb');

const firebase = require('../../firebase/firebaseConfig');
const usersModel = require('./login.server.model.js');

let uid_producer=1000;

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
        FIREBASE_UID: firebase_uid
    }

    firebase.auth().verifyIdToken(usertoken).then(function(decodedToken) { //UID 인증
        firebase_uid = decodedToken.uid;

        usersModel.findOne(findConditionLocalUser).exec(function (err, user) {
            if (err) {
                res.json({msg: "user show fail"});
                console.log('유저 검색 실패');
                console.log(err);
            }
            else if(!user) {
                console.log(user);
                usersModel.guestUsersAdd(firebase_uid, username, weight,sex,capacity, function(err, result){
                    if(err){
                        res.json({ msg:"게스트 유저 등록 실패"});
                        console.log('게스트 유저 등록 실패');
                        console.log(err);
                    }
                    else{
                        res.json({ msg: '게스트 유저 등록 성공', data : result}); // 토큰들어있음
                        console.log('게스트 유저 등록 성공');
                        //토큰 만들어주기
                    }
                })
            }
            else if(user) {
                console.log(user);
                res.json({ msg: '게스트 유저로 로그인', data:user});
                //토큰 만들어주기
            }
        })
    }).catch(function(error) {
        console.log(error);
    });
}


/* 2) 페이스북 로그인 */

exports.loginAsFacebook = function(req, res, next) {
    let accessToken = 'EAAEDyqKIrW8BAMXWZAkWkWXXBOnpZCOb81fuZBGv56ZAIZCL2vcvkqGTVg1KERXJgSZCkvkuxBVBzJthyZC4fyucewGhETZAWf4v2BoIiIy8prFvS23897TrvZCyZAhOfpXfJJCxvGoDEQR4VmJ4cQyZCsEXXZBPvVR8uUTcwtHzqzWWXqd9g37wSGMRKUgH8zdZB1kKrP5KKXpVZBbgZDZD';
    //기본 정보
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;
    let email;

    FB.setAccessToken(accessToken);

    FB.api('me', { fields: ['id','email'], access_token: accessToken }, function (res) {
        email = res.email;
        console.log(email);
    });

    let findConditionFBUser = {
        email:email
    }

    usersModel.findOne(findConditionFBUser).exec(function (err, user) {
        if (err) {
            res.json({msg: "user show fail"});
            console.log('유저 검색 실패');
            console.log(err);
        }
        else if(!user) {
            usersModel.FBUsersAdd(accessToken,email, username, weight,sex,capacity, function(err, token){
                if(err){
                    res.json({ msg:"게스트 유저 등록 실패"});
                    console.log('게스트 유저 등록 실패');
                    console.log(err);
                }
                else{
                    res.json({ msg: '게스트 유저 등록 성공', data : token}); // 토큰들어있음
                    console.log('게스트 유저 등록 성공');
                }
            })
        }
        else if(user) {
            res.json({ msg: '게스트 유저로 로그인'});
        }
    })

}







/*  유저 생성 함수들   */
//1) 게스트 로그인 생성 함수
usersModel.guestUsersAdd = function(firebase_uid, username, weight, sex, capacity, callback){
    //맞춤 토큰생성
    var uid = uid_producer;
    uid_producer++;
    var customToken = firebase.auth().createCustomToken(uid);

    const userData = {
        FIREBASE_UID: firebase_uid,
        USERNAME: username,
        WEIGHT: weight,
        SEX: sex,
        CAPACITY: capacity,
        JWT_UID: uid
    };

    usersModel.create(userData, function(err, result){
        if (err) {
            callback(new Error('유저 등록 실패'));
            console.log(err);
        }
        else {
            callback(null, result);
        }
    });
};

//2) 페이스북 로그인 생성 함수
usersModel.FBUsersAdd = function(accessToken,email, username, weight, sex, capacity, callback){
    //맞춤 토큰생성
    var uid = uid_producer;
    uid_producer++;
    var customToken = firebase.auth().createCustomToken(uid);

    const userData = {
        ACESSTOKEN: accessToken,
        EMAIL: email,
        USERNAME: username,
        WEIGHT: weight,
        SEX: sex,
        CAPACITY: capacity,
        JWT_UID: uid
    };

    usersModel.create(userData, function(err, result){
        if (err) {
            callback(new Error('유저 등록 실패'));
        }
        else {
            callback(null, customToken);
        }
    });
};