"use strict";
const express = require('express');
const ctrl = require('./login.server.controller')
const router = express.Router();

/* 게스트로 로그인하기 */
router.post('/guest', ctrl.loginAsGuest);
/* 페이스북으로 로그인하기 */
router.post('/facebook', ctrl.loginAsFacebook);

module.exports = router;