"use strict";
var express = require('express');
var router = express.Router();
var path = require('path');
let mongoose = require('mongoose');

let timeLineSchema = new mongoose.Schema({
    TODAY: {type: String},
    UID: {type: String},
    USERNAME: {type: String},
    TIMELINE_DATA: [{
        TIME: {type: String},
        ALCOLID: {type: Number},
        SHOT: {type: Number},
        STICKER: {type: [Number]}
    }
    ]
});

module.exports = mongoose.model('TIMELINE_COL',timeLineSchema, 'TIMELINE_COL');