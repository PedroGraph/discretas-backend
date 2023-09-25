const express = require('express');

const {getOrders, setOrder} = require('../controllers/Orders/orders');    

const router= express.Router();

router.get('/:userId', getOrders);
router.post('/addNewOrder', setOrder);

module.exports=router;
