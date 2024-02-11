
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../../config/database.js';
import bcrypt from 'bcrypt';

export const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
    allowNull: false
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

export class UserModel {

  async createUser(user) {
    try {
      const hashedPassword = await this.generatePasswordHash(user.password);
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      },{
        attributes:  ['id', 'email', "firstName", "lastName", "isAdmin", "accountStatus", "lastLogin"],
      });
      return newUser?.dataValues ?? null;
    } catch (error) {
      console.log(`Server error: Has been an error creating the user. Error Message: ${error}`);
    }
  }

  async getUserInformation({ email }) {
    try {
      const user = await User.findOne({ where: { email } });
      if (user) return user;
      return null;
    } catch (error) {
      console.log(`Error Sever: Has been an error getting the user. Error Message: ${error}`);
    }

  }

  async getUserById({ id }) {
    try {
      const user = await User.findByPk(id);
      if (user) return user;
      return null;
    } catch (error) {
      console.log(`Error Sever: Has been an error getting the user with id ${id}. Error Message: ${error}`);
    }

  }

async getAllUsers(filter = null) {
  try {
    const whereClause = filter
      ? {
          [sequelize.Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('firstName')),
              'LIKE',
              `%${filter.toLowerCase()}%`
            ),
            sequelize.where(
              sequelize.fn('lower', sequelize.col('lastName')),
              'LIKE',
              `%${filter.toLowerCase()}%`
            ),
            sequelize.where(
              sequelize.fn('lower', sequelize.col('email')),
              'LIKE',
              `%${filter.toLowerCase()}%`
            ),
          ],
        }
      : {};

    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'accountStatus', 'lastLogin'],
      where: whereClause,
    });

    if (users) return users;
    return null;
  } catch (error) {
    console.log(`Error Sever: There has been an error getting the users. Error Message: ${error}`);
  }
}

  async deleteUserById(id) {
    try {
      const deletedUser = await User.destroy({ where: { id } });
      if (deletedUser) return deletedUser;
      return null;
    } catch (error) {
      console.log(`Error Sever: Has been an error deleting the user with id ${id}. Error Message: ${error}`);
    }

  }

  async updateUserById(id, user) {
    try {
      const [updatedRowCount, updatedUserRecords] = await User.update(user, { where: { id }, returning: true });
      if (updatedRowCount === 0)return null;
      if (Array.isArray(updatedUserRecords) && updatedUserRecords.length > 0) return updatedUserRecords[0];
      return null;
    } catch (error) {
      console.log(`Server error: There has been an error updating the user with id ${id}. Error Message: ${error}`);
    }
  }
  

  async login(email, password) {
    try {
      if (!email || !password) return null;
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
      if (!isPasswordValid) return null;
      return user;
    } catch (error) {
      console.log(`Error Sever: Has been an error logging in. Error Message: ${error}`);
    }

  }

  async generatePasswordHash(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async resetPassword(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      return user;
    } catch (error) {
      console.log(`Error Sever: Has been an error resetting the password. Error Message: ${error}`);
    }

  }

}