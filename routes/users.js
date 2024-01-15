
import {Router} from 'express';
import {authenticateUser} from '../controllers/Middleware/userMiddleware.js';
import { UserController } from '../controllers/Users/user.js';

export const creatingUserRouter = ({ userModel }) => {

    const userController = new UserController(userModel);
    const userRouter = Router();
    // Rutas CRUD
    userRouter.post('/create', userController.createUser);
    userRouter.get('/all', userController.getAllUsers);
    userRouter.get('/getuser/:id', userController.getUserById);
    userRouter.put('/updateuser/:id',  userController.updateUserById);
    userRouter.delete('/deleteuser/:id',  userController.deleteUserById);

    // Ruta de inicio y cierre de sesión
    userRouter.post('/login', userController.login);
    userRouter.post('/googleLogin', userController.loginWithGoogle);
    userRouter.post('/logout', userController.logout);

    // Ruta para la actualización de la contrasenya

    return userRouter;

}
