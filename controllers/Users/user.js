import { User } from '../../models/database/user.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Middleware/userMiddleware.js';
import {  addRevokedToken } from '../Token/revokedToken.js';
import logger from '../../logCreator/log.js';
import admin from 'firebase-admin'
import serviceAccount from '../../serviceAccountKey.json' assert { type: 'json' };

export const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, address, city, phoneNumber } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
      city,
      phoneNumber,
    });
    const userInfo = user.dataValues;

    if(process.env.NODE_ENV === 'TEST') res.status(201).json({ userInfo, token: generateToken(user) });
    
    res.status(201).json({ info: 'User created' });
    
  } catch (error) {
    logger.error('Error to create user:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    loogger.info('Get all users', users);
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error to get all users:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn('User not found:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    logger.info('Get user by ID:', userId);
    res.json(user);
  } catch (error) {
    logger.error('Error to get user by ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    const [updatedRowCount, [updatedUserRecord]] = await User.update(updatedUser, {
      where: { id: userId },
      returning: true,
    });

    if (updatedRowCount === 0) {
      logger.warn('User not found:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    logger.info('User updated:', userId);
    res.json(updatedUserRecord);
  } catch (error) {
    logger.error('Error to update user by ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedRowCount = await User.destroy({ where: { id: userId } });

    if (deletedRowCount === 0) {
      logger.warn('User not found:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    logger.info('User deleted:', userId);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    logger.error('Error to delete user by ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.cookies)

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn('User not found to login: ', email);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Invalid credential to login: ', email);
      return res.status(401).json({ message: 'Credenciales incorrectas' });
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

export const logout = async (req, res) => {
  try{
    const token = req.cookies.sessionId;
    const isTokenRevoked = await findRevokedToken(token);
    if (!isTokenRevoked) await addRevokedToken(token);
    res.clearCookie('sessionId');
    logger.info('Logout successful: ', req.cookies.sessionId);
    res.status(200).json({ message: 'Logout exitoso' });
  }catch(error){
    logger.error('Error to logout:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

export const loginWithGoogle = async (req, res) => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const tokenId = req.body.idToken;
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    const token = generateToken(uid);

    res.cookie('sessionId', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      secure: true, 
      sameSite: 'None', // Para permitir el envío en solicitudes cruzadas
    });

    logger.info('Login successful: ', uid);
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error en la autenticación de Google' });
  }
}
