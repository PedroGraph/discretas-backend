const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

    productID: {
        type: String,
        required: true,
        maxlength: 500,
    },
    stars: {
        type: String,
        required: true,
    },
    uid:{
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('rating', ratingSchema);