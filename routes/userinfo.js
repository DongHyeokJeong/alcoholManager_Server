"use strict";
var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');
let firebase = require('../firebase/firebaseConfig');

let usersSchema = new mongoose.Schema({
    USERTOKEN: {type: String},
    USERNAME: {type: String},
    WEIGHT: {type: Number},
    SEX: {type: Number},
    CAPACITY: {type: Number}
});

let usersModel = mongoose.model('USERS_COL',usersSchema, 'USERS_COL');

//***************************router 사용*******************************//
/* 사용자 개인정보 보여주기 */
router.get('/', routerUserinfoShow);
/* 사용자 개인정보 등록하기 */
router.post('/', routerUserinfoAdd);
/* 사용자 개인정보 수정하기 */
router.put('/', routerUserinfoChange);

//********************** router 내 사용함수 정의***************************//
// 1.user Data 등록함수
function routerUserinfoAdd(req, res, next) {
 let usertoken = req.body.usertoken;
 let username = req.body.username;
 let weight = req.body.weight;
 let sex = req.body.sex;
 let capacity = req.body.capacity;
 /*let logintype = req.body.logintype;  // 1:익명 2:페이스북*/

 firebase.auth().verifyIdToken(usertoken).then(function(decodedToken) {
    let uid = decodedToken.uid;

     usersModel.usersAdd(uid, username, weight,sex,capacity, function(err, result){
         if(err){
             res.json({ msg:"user register fail"});
             console.log('유저 등록 실패');
             console.log(err);
         }
         else{
             res.json({ msg: 'user register success', data : result});
             console.log('유저 등록 성공');
         }
         })// ...
         }).catch(function(error) {
             console.log(error);
         });
 }

/*function routerUserinfoAdd(req, res, next) {     //테스트용
    let usertoken = req.body.usertoken;
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;

    usersModel.usersAdd(usertoken, username, weight,sex,capacity, function(err, result){
        if(err){
            res.json({ msg:"user register fail"});
            console.log('유저 등록 실패');
            console.log(err);
        }
        else{
            res.json({ msg: 'user register success', data : result});
            console.log('유저 등록 성공');
        }
    })

}*/

usersModel.usersAdd = function(usertoken, username, weight,sex,capacity, callback){
    const userData = {
        USERTOKEN: usertoken,
        USERNAME: username,
        WEIGHT: weight,
        SEX: sex,
        CAPACITY: capacity
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


// 2.user Data 보여주는 함수____________________________________________________________________________________
function routerUserinfoShow(req, res, next) {
    let usertoken = req.headers['usertoken'];

    firebase.auth().verifyIdToken(usertoken).then(function (decodedToken) {
        var uid = decodedToken.uid;

        usersModel.usersCheck(uid, function (err, result) {
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

/*function routerUserinfoShow(req, res, next) {    //테스트용
    let uid = 'kk';

    usersModel.usersCheck(uid, function (err, result) {
            if (err) {
                res.json({msg: "user register fail"});
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
}*/

usersModel.usersCheck = function(uid, callback){
    usersModel.find({USERTOKEN:uid}, function(err, result){
        if (err) {
            callback(new Error('유저 검색 실패'));
        } else {
            callback(null, result);
        }
    });
}


// 3.user Data 바꾸는 함수 ------------------------------------------------------------------------------------
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

/*function routerUserinfoChange(req, res, next) {  //테스트용
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;
    let uid = req.body.usertoken;

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
    })
}*/

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