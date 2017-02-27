"use strict";
var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    USERTOKEN: {type: String},
    USERNAME: {type: String},
    WEIGHT: {type: String},
    SEX: {type: Number},
    CAPACITY: {type: String}
});

let usersModel = mongoose.model('USERS_COL',usersSchema, 'USERS_COL');

//***************************router 사용*******************************//

router.post('/', routerUsersAdd);    //userData 등록

//********************** router 내 사용함수 정의***************************//
// 1.user Data 등록함수
function routerUsersAdd(req, res, next) {
    let usertoken = req.fields.usertoken;
    let username = req.fields.username;
    let weight = req.fields.weight;
    let sex = req.fields.weight;
    let capacity = req.fields.capacity;

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


module.exports = router;
