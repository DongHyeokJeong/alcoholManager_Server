"use strict";
const express = require('express');
const ctrl = require('./timeLine.controller.js')
const router = express.Router();

//***************************routetr 사용*******************************//
router.post('/object', ctrl.routerTimeLineObjectAdd);    //timeine 객체 만들기
router.post('/', ctrl.routerTimeLineAdd);    //timeine 등록
router.get('/', ctrl.routerTimeLineShow);     //timeline 보기
router.put('/sticker', ctrl.routerTimeLineAddSticker);     //timeline sticker 붙이기
router.put('/sticker', ctrl.routerTimeLineDeleteSticker);     //timeline sticker 삭제하기
router.post('/sync', ctrl.routerTimeLineSync);     //timeline data 안드와 동기화


module.exports = router;