
import express from 'express';
import {authenticateUser} from '../controllers/Middleware/userMiddleware.js';
import {createUser, login, loginWithGoogle, logout, getUserById, getAllUsers, updateUserById, deleteUserById} from '../controllers/Users/user.js';

const router = express.Router();

// Rutas CRUD
router.post('/create', createUser);
router.get('/all', authenticateUser, getAllUsers);
router.get('/getuser/:id', authenticateUser, getUserById);
router.put('/updateuser/:id', authenticateUser, updateUserById);
router.delete('/deleteuser/:id', authenticateUser, deleteUserById);

// Ruta de inicio de sesión
router.post('/login', login);
router.post('/googleLogin', loginWithGoogle);
router.post('/logout', logout);

export default router;
