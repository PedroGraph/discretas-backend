const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    uid:{
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    idcard: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    photourl: {
        type: String,
        required: false,
    }
}, {
    versionKey: false,
});

module.exports = mongoose.model('users', users);
