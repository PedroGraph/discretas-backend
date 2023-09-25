const express = require('express');

const {getComments, setComment} = require('../controllers/Comments/comments');    

const router= express.Router();

router.get('/:id', getComments);
router.post('/addComment', setComment);

module.exports=router;
