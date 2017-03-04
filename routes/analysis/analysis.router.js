"use strict";
const express = require('express');
const ctrl = require('./analysis.controller')
const router = express.Router();


//***************************routetr 사용*******************************//
router.post('/',ctrl.analysisDrinkHistoryToday);             //동기화 후 현재 알코올량 계산




module.exports = router;