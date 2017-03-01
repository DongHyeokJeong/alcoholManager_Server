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
/*function routerUserinfoAdd(req, res, next) {
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

function routerUserinfoAdd(req, res, next) {
    let usertoken = req.body.usertoken;
    let username = req.body.username;
    let weight = req.body.weight;
    let sex = req.body.sex;
    let capacity = req.body.capacity;

    firebase.auth().verifyIdToken(usertoken).then(function(decodedToken) {
        var uid = decodedToken.uid;

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
        // Handle error
    });
}

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

// 2.user Data 보여주는 함수
function routerUserinfoShow(req, res, next) {


}

// 3.user Data 바꾸는 함수
function routerUserinfoChange(req, res, next) {
    let usertoken = req.fields.usertoken;
    let username = req.fields.username;
    let weight = req.fields.weight;
    let sex = req.fields.sex;
    let capacity = req.fields.capacity;

}

module.exports = router;
