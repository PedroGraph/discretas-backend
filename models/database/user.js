
import { DataTypes }from 'sequelize';
import sequelize from '../../config/database.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resetToken: {
    type: DataTypes.STRING,
  },
  resetTokenExpiration: {
    type: DataTypes.DATE,
  },
  emailSubscription: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, 
  },
  accountStatus: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    defaultValue: 'active',
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
});

export { User };
