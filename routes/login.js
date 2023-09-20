const express = require('express');
const authMiddleware = require('../controllers/Middleware/middleware');
const { loginUser, registerUser, getUser, getUserInfo, updateUser } = require('../controllers/Users/User');

const router= express.Router();
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/userinfo', getUserInfo);
router.put('/updateUser', updateUser);
router.get('/protected', authMiddleware, getUser);

module.exports=router;
