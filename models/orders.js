const mongoose = require('mongoose');

const Orders = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        maxlength: 500,
    },
    products: {
        type: Array,
        required: true,
    },
    shippingAddress: {
        type: Map,
        required: true
    },
    orderDate:{
        type: Date,
        required: true,
    },
    totalPrice:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('orders', Orders);