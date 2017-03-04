"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let drinkHistoryTodaySchema = new Schema({
    UID: {type: String},
    HISTORY: [
        {
            TIME: {type: String},
            SHOTSUM: {type: String},
            ALCOHOL: {type: String}
        }
    ]
});


module.exports = mongoose.model('DRINK_HISTORY_TODAY_COL', drinkHistoryTodaySchema, 'DRINK_HISTORY_TODAY_COL');