const express = require('express');
const authMiddleware = require('../controllers/Middleware/middleware');
const {loginUser, registerUser, getUser} = require('../controllers/Users/User');

const router= express.Router();
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/protected', authMiddleware, getUser);

module.exports=router;
