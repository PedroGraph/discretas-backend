import { generateToken } from '../Middleware/userMiddleware.js';
import { addRevokedToken, findRevokedToken } from '../Token/revokedToken.js';
import logger from '../../logCreator/log.js';
import {passwordRecoveryCode} from '../../utils/generatePasswordCode.js';
import { sendPasswordRecoveryEmail } from '../../utils/nodemails.js';
import { verifyGoogleToken } from '../../models/google/googleAdmin.js';

export class UserController {
  constructor(userModel, notificationModel, addressModel) {
    this.userModel = userModel;
    this.notificationModel = notificationModel;
    this.addressModel = addressModel;
  }

  createUser = async (req, res) => {
    try {
      const userInfo = req.body;
      const newUser = await this.userModel.createUser(userInfo);
      await this.notificationModel.addNotificationToUser({ userId: newUser.id });
      logger.info('A new user has been created');
      if (newUser) res.status(201).json({ success: true });
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
      let user;
      const userInfo = req.params.id;
      if(userInfo.includes('@')) user = await this.userModel.getUserInformation(userInfo);
      else user = await this.userModel.getUserById({ id: userInfo });
      

      if(!user) return res.status(200).json({ message: 'User not found' });
      
      const addresses = await this.addressModel.getAddressesByUserId(user.id);

      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses.find(address => address.default);
        user.address = defaultAddress.street;
        user.city = defaultAddress.city;
        user.state = defaultAddress.state;
        user.phoneNumber = defaultAddress.phone;
      }

      return res.status(200).json(user);

    } catch (error) {
      logger.error('Error to get user by ID:', error);
      console.log(error);
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
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      const token = generateToken(user.id);
  
      res.cookie('DSDSsessionId', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: process.env.NODE_ENV === 'production', 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' 
          ? 'discreta-seduccion.web.app'
          : 'localhost'
      });
  
      logger.info('Login successful:', email);
      res.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
        }
      });
  
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  };

  logout = async (req, res) => {
    try {
      if(!req.headers.cookie) return res.status(401).json({ message: 'Token no proporcionado.' });
      const cookieInfo = req.headers.cookie;
      const match = cookieInfo.match(/DSsessionId=([^;]+)/);
      const token = match ? match[1] : null;
      if(!token) return res.status(401).json({ message: 'Token no proporcionado.' });

      const isTokenRevoked = await findRevokedToken(token);
      if (!isTokenRevoked) await addRevokedToken(token);

      res.clearCookie('DSsessionId', {
        path: "/",
        domain: process.env.NODE_ENV === "production"
          ? "discreta-seduccion.web.app"
          : "localhost",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });
      logger.info('Logout successful: ', req.cookies.DSsessionId);

      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      logger.error('Error to logout:', error);
      console.log(error)
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  loginWithGoogle = async (req, res) => {
    try {
      const tokenId = req.body.idToken;
      const decodedToken = await verifyGoogleToken(tokenId);
      const uid = decodedToken.uid;

      const user = await this.userModel.getUserInformation(req.body.email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      const token = generateToken(uid);
  
      res.cookie('DSDSsessionId', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: process.env.NODE_ENV === 'production', 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' 
          ? 'discreta-seduccion.web.app'
          : 'localhost'
      });
  
      logger.info('Login successful:', uid);
      res.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
        }
      });
  
    } catch (error) {
      logger.error('Login error:', error);
      console.log(error);
      res.status(500).json({ 
        success: false, 
        error: 'Error en la autenticación de Google' 
      });
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

  passwordRecovery = async (req, res) => {
    try {
      const { email } = req.body;

      if(!email) return res.status(400).json({ message: 'Email is required' });

      const user = await this.userModel.getUserInformation(email);

      if (!user) {
        logger.warn('Password recovery failed: ', email);
        return res.status(404).json({ message: 'User not found' });
      }

      const token = passwordRecoveryCode();
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;

      await this.userModel.updateUserById(user.id, user);

      const encodedEmail = Buffer.from(email).toString('base64');
      const recoveryUrl = `${process.env.NODE_ENV === 'test' ? process.env.SITE_URL_TEST : process.env.SITE_URL_PROD}/recovery-password/success/${encodedEmail}`;

      const response = await sendPasswordRecoveryEmail({
        email: user.email,
        recoveryUrl,
        resetToken: token,
      });

      if (user) logger.info(`Email sent to: `, email);
      return res.status(200).json({ encodedEmail });

    } catch (error) {
      logger.error('Error to recover password:', error);
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

   verifyPasswordRecoveryCode = async (req, res) => {
    try {
      const { email: encodedEmail, recoveryCode } = req.body;
      const email = Buffer.from(encodedEmail, 'base64').toString('utf-8');
      const user = await this.userModel.getUserInformation(email, true);

      if (!user) {
        logger.warn('Password recovery failed: ', email);
        return res.status(404).json({ message: 'User not found' });
      }
    
      if (user.resetToken.replace(/-/g, '') === recoveryCode.replace(/-/g, '') && user.resetTokenExpiration > Date.now()) {
        const resetToken = 0; 
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await this.userModel.updateUserById(user.id, user);
        logger.info('Password recovery successful: ', email);
        return res.status(200).json({ info: 'Password recovery successful' });
      }

      logger.warn('Invalid recovery code or expired: ', email);
      return res.status(400).json({ message: 'Invalid or expired recovery code' });

    } catch (error) {
      console.log(error);
      logger.error('Error to verify password recovery code:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };
  
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

  getNotificationsByUserId = async (req, res) => {  
    try {
      const { userId } = req.params;
      if(!userId) return res.status(400).json({ error: 'User id is required' });

      const notifications = await this.notificationModel.getNotificationsByUserId(userId);
      if (!notifications) {
        logger.warn(`Notifications not found for user ${userId}`);
        return res.status(404).json({ error: 'Notifications not found' });
      }
      logger.info(`Notifications found for user ${userId}`);
      return res.status(200).json(notifications);
    } catch (error) {
      logger.error(`Error obtaining notifications - Server error. Error message: ${error}`);
      res.status(500).json({
        error: `Error server: the notifications could not be obtained. Error message: ${error}`,
      });
    }
  }

  updateNotificationById = async (req, res) => {
    try {
      const { userId } = req.params;
      if(!userId) return res.status(400).json({ error: 'User id is required' });
      
      const updatedNotification = req.body;
      const response = await this.notificationModel.updateNotificationById(userId, updatedNotification);
      if (response) {
        logger.info(`Notification ${userId} updated successfully`);
        return res.status(200).json(updatedNotification);
      }
      logger.warn(`Notification ${userId} not updated`);
      return res.status(404).json({ error: 'Notification not found' });
    }
    catch (error) {
      logger.error(`Error updating notification ${userId} - Server error`);
      res.status(500).json({ error: `Error server: the notification could not be updated. Error message. ${error}` });
    }
  }
}