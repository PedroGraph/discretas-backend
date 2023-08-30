const express = require('express');

const {updateStars, ratingInfo} = require('../controllers/Rating/update');    

const router= express.Router();

router.post('/product', updateStars);
router.post('/ratingInfo', ratingInfo);

module.exports=router;
