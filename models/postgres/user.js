
import { DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../../config/database.js';
const { Op } = Sequelize;
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

  async getUserInformation( email ) {
    try {
      const user = await User.findOne({ where: { email: email } });
      const {password, ...userInfo} = user?.dataValues;
      if (user) return userInfo;
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

  async getAllUsers(queryParams = {}) {
    try {
      const { filter, page = 1, pageSize = 10, ...additionalFilters } = queryParams;

      const whereClause = filter
        ? {
            [Op.or]: [
              Sequelize.where(
                Sequelize.fn('lower', Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName'))),
                'LIKE',
                `%${filter.toLowerCase()}%`
              ),
              Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('email')),
                'LIKE',
                `%${filter.toLowerCase()}%`
              ),
            ],
            ...additionalFilters,
          }
        : { ...additionalFilters };

      const { count, rows: users } = await User.findAndCountAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'accountStatus', 'lastLogin'],
        where: whereClause,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

      return { users, totalRecords: count };
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
      if(user.password) user.password = await this.generatePasswordHash(user.password);
      const [updatedRowCount, updatedUserRecords] = await User.update(user, { where: { id }, returning: true });
      if (updatedRowCount === 0)return null;
      if (Array.isArray(updatedUserRecords) && updatedUserRecords.length > 0) return updatedUserRecords[0];
      return null;
    } catch (error) {
      console.log(`Server error: There has been an error updating the user with id ${id}. Error Message: ${error}`);
    }
  }
  

  async login(email, userPassword) {
    try {
      if (!email || !userPassword) return null;
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      const isPasswordValid = await bcrypt.compare(userPassword, user.dataValues.password);
      if (!isPasswordValid) return null;
      const {password, resetToken, resetTokenExpiration, emailSubscription, lastLogin, createdAt, updatedAt, ...userInfo} = user.dataValues;
      return userInfo;
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
