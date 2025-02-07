import jwt from 'jsonwebtoken';
import { findRevokedToken } from '../Token/revokedToken.js';

const generateToken = (user) => {
  return jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, `${process.env.JWT_SECRET}_${user.id}`, { expiresIn: '12h' });
};

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.DSsessionId;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado. Tal vez no has iniciado sesión' });
  }

  const isTokenRevoked = await findRevokedToken(token);
  if (isTokenRevoked) {
    return res.status(401).json({ message: 'Token revocado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = decoded; 
    next();
  });
};

export { generateToken, authenticateUser };
