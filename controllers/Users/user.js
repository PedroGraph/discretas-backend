import { generateToken } from '../Middleware/userMiddleware.js';
import { addRevokedToken } from '../Token/revokedToken.js';
import logger from '../../logCreator/log.js';
import admin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json' assert { type: 'json' };
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
import { UserModel } from '../../models/postgres/user.js';

export class UserController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  createUser = async (req, res) => {
    try {
      const userInfo = req.body;
      const newUser = await this.userModel.createUser(userInfo);
      logger.info('A new user has been created');
      if (newUser) res.status(201).json({ info: newUser });
    } catch (error) {
      logger.error('Error to create user:', error);
      res.status(500).json({ message: error });
      console.log('Error to create user:', error);
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userModel.getAllUsers();
      logger.info('Getting all users', users);
      if (users) res.status(200).json(users);
      else res.status(404).json({ message: 'No users found' });
    } catch (error) {
      logger.error('Error to get all users:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await this.userModel.getUserById({ id: userId });
      logger.info('Getting user by ID:', userId);
      if (user) res.status(200).json(user);
      else res.status(404).json({ message: 'User not found' });
    } catch (error) {
      logger.error('Error to get user by ID:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  updateUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const updateUser = req.body;

      const updatedUser = await this.userModel.updateUserById(userId, updateUser);
      if (updatedUser) {
        logger.info('User updated:', userId);
        return res.status(200).json(updatedUser);
      }
      logger.warn('User not updated:', userId);
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      logger.error('Error to update user by ID:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  deleteUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await this.userModel.deleteUserById(userId);
      if (deletedUser) {
        logger.info('User deleted:', userId);
        return res.status(204).json({ message: 'Usuario eliminado correctamente' });
      }
      logger.warn('User not deleted:', userId);
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      logger.error('Error to delete user by ID:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.userModel.login(email, password);

      if (!user) {
        logger.warn('Login failed: ', email);
        return res.status(401).json({ message: 'Credentials invalid' });
      }
      const token = generateToken(user);

      res.cookie('sessionId', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'None', // Para permitir el envío en solicitudes cruzadas
      });

      logger.info('Login successful: ', email);
      res.json({ token });

    } catch (error) {
      console.error('Error to login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

  logout = async (req, res) => {
    try {
      const token = req.cookies.sessionId;
      const isTokenRevoked = await findRevokedToken(token);
      if (!isTokenRevoked) await addRevokedToken(token);
      res.clearCookie('sessionId');
      logger.info('Logout successful: ', req.cookies.sessionId);
      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      logger.error('Error to logout:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }



  loginWithGoogle = async (req, res) => {
    try {

      const tokenId = req.body.idToken;
      const decodedToken = await admin.auth().verifyIdToken(tokenId);
      const uid = decodedToken.uid;

      const token = generateToken(uid);

      res.cookie('sessionId', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });

      logger.info('Login successful: ', uid);
      res.json({ token });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error en la autenticación de Google' });
    }
  }

  resetPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.resetPassword(email, password);
      if (user) {
        logger.info('Password reset successful: ', email);
        return res.status(200).json({ message: 'Password reset successful' });
      }
      logger.warn('Password reset failed: ', email);
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      logger.error('Error to reset password:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}