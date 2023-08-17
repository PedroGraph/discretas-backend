const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({

    productID: {
        type: String,
        required: true,
        maxlength: 500,
    },
    stars: {
        type: Number,
        required: false,
    }
    
});

module.exports = mongoose.model('rating', ratingSchema);