const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    stars: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
        maxlength: 500,
    },
    productType: {
        type: String,
        required: true,
        maxlength: 50,
    },
    image: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    characteristics:{
        type: Array,
        required: true,
    }
    
    
    
});

module.exports = mongoose.model('products', productSchema);