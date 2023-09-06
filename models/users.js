const mongoose = require('mongoose');

const users = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    uid:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    }
    
}, {
    versionKey: false,
});

module.exports = mongoose.model('users', users);