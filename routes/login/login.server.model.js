const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usersSchema  = new Schema({
    FIREBASE_UID: {type: String},
    ACESSTOKEN: {type: String},
    EMAIL: {type: String},
    USERNAME: {type: String},
    WEIGHT: {type: Number},
    SEX: {type: Number},
    CAPACITY: {type: Number},
    JWT_UID: {type: String}
});

module.exports = mongoose.model('USERS_COL',usersSchema, 'USERS_COL');