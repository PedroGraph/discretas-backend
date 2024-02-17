import { generateToken } from '../Middleware/userMiddleware.js';
import { addRevokedToken } from '../Token/revokedToken.js';
import logger from '../../logCreator/log.js';
import {passwordRecoveryCode} from '../../utils/generatePasswordCode.js';
import { sendPasswordRecoveryEmail } from '../../utils/nodemails.js';
import { verifyGoogleToken } from '../../models/google/googleAdmin.js';

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
      const { filter, page, pageSize, ...additionalFilters } = req.query; 

      const users = await this.userModel.getAllUsers({ filter, page, pageSize, ...additionalFilters });

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

      logger.info('Login successful: ', email);
      res.json({ token, user });

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
      const decodedToken = await verifyGoogleToken(tokenId);
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
      const user = await userModel.resetPassword(email, password);
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

  passwordRecovery = async (req, res) =>{
    try{
      const { email } = req.body;
      const user = await this.userModel.getUserInformation(email);

      if (!user) {
        logger.warn('Password recovery failed: ', email);
        return res.status(404).json({ message: 'User not found' });
      }

      const token = passwordRecoveryCode();
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; 
      const updatedUser = await this.userModel.updateUserById(user.id, user);
      const response = await sendPasswordRecoveryEmail(updatedUser.dataValues);

      if (response) {
        logger.info(`Email sent to: `, email);
        return res.status(200).json({ info: 'A code has been sent to your email. Please check your email' });
      }

      logger.warn('Password recovery failed: ', email);
      return res.status(404).json({ message: 'User not found' });

    } catch (error) {
      logger.error('Error to recovery password:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  verifyPasswordRecoveryCode = async (req, res) => {
    try {
      const { email, recoveryCode } = req.body;
      const user = await this.userModel.getUserInformation(email);
      if (!user) {
        logger.warn('Password recovery failed: ', email);
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.resetToken === recoveryCode && user.resetTokenExpiration > Date.now()) {
        logger.info('Password recovery successful: ', email);
        return res.status(200).json({ info: 'Password recovery successful' });
      }
      logger.warn('Password recovery failed: ', email);
      return res.status(404).json({ message: 'User not found' }); 
    } catch (error) {
      logger.error('Error to verify password recovery code:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
  
  changePassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.userModel.getUserInformation(email);
      if (user) {
        user.password = password;
        const updatedUser = await this.userModel.updateUserById(user.id, user);
        logger.info('Password change successful: ', email);
        return res.status(200).json({ info: 'Password change successful' });
      }
      logger.warn('Password change failed: ', email);
      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      logger.error('Error to change password:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

}