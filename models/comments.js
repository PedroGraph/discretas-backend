const mongoose = require('mongoose');

const comments = new mongoose.Schema({

    productID: {
        type: String,
        required: true,
        maxlength: 500,
    },
    stars: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    photourl:{
        type: String,
        required: false
    },

}, {
    versionKey: false,
});

module.exports = mongoose.model('comments', comments);