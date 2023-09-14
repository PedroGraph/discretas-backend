require ('dotenv').config();
const { AUTH_KEY }=process.env;
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (userId) => {

    const secretKey = `${AUTH_KEY}`;

    const expiresIn = '1h';

    return jwt.sign({ userId }, secretKey, { expiresIn });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Rellena los datos para iniciar sesión' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Es posible que el email y/o contraseña no coincidan' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(200).json({ message: 'Es posible que el email y/o contraseña no coincidan' });
        }

        const token = generateToken(user._id);

        res.status(200).json({ token, userId: user.uid });
        } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

const registerUser = async (req, res) => {

    try {
        const { name, email, password, last_name, phone, uid } = req.body;
    
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'Faltan datos' });
        }

        const verifyUser = await User.findOne({ email });

        if(verifyUser){
            return res.status(200).json({ message: "Correo registrado. Intenta con otro correo."});
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = new User({
          name,
          email,
          last_name,
          password: hashedPassword,
          phone,
          uid
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({ token });
        
      } catch (error) {

        console.log(error)

        res.status(500).json({ message: error.message });

    }
}

const getUser = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.json({ user: user.name });
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
};

const getUserInfo = async (req, res) => {

    try {
      const userId = req.body.userId;
      const user = await User.findOne({uid: userId});
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUserInfo,
    getUser
} ;
