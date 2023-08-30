require ('dotenv').config();
const { AUTH_KEY }=process.env;
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    const secretKey = `${AUTH_KEY}`;
    return jwt.verify(token, secretKey);
};
  
const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No se proporcionó el token' });
    }
    const token = authHeader.split(' ')[1];
  
    try {
      const { userId } = verifyToken(token);
    
      req.userId = userId;
      next();

    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
};


module.exports = authMiddleware;