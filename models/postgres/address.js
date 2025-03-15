import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { User } from './user.js'; // Asegúrate de importar el modelo User

export const Address = sequelize.define('address', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    indications: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    property: {
        type: DataTypes.ENUM('hogar', 'apartamento'),
        allowNull: false,
    },
    default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

Address.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
User.hasMany(Address, { foreignKey: 'userId', sourceKey: 'id' });

export class AddressModel {

    async addAddressToUser(addressData) {
        try {
            const newAddress = await Address.create({
                ...addressData,
            });
            return newAddress;
        } catch (error) {
            console.log(error);
        }
    }

    async getAddressById(addressId) {
        try {
            const address = await Address.findByPk(addressId);
            if (!address) return null;
            const { password, resetToken, resetTokenExpiration, emailSubscription, updatedAt, createdAt, ...userInfo } = address.dataValues;
            return addressInfo;
        } catch (error) {
            console.log(`Error Sever: Has been an error getting the address with id ${addressId}. Error Message: ${error}`);
        }
    }

    async getAddressesByUserId(userId) {
        try {
            const addresses = await Address.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
            });
            return addresses.length === 0 ? null : addresses.map(address => address.dataValues);
        } catch (error) {
            console.log(`Error Sever: Has been an error getting the addresses with userId ${userId}. Error Message: ${error}`);
        }
    }

    async updateAddressById(addressId, updatedAddress) {
        try {
            const [updatedRowCount, updatedAddressRecords] = await Address.update(updatedAddress, {
                where: { id: addressId },
                returning: true,
            });
            if (updatedRowCount === 0) return null;
            if (Array.isArray(updatedAddressRecords) && updatedAddressRecords.length > 0) return updatedAddressRecords[0];
            return null;
        } catch (error) {
            console.log(`Server error: There has been an error updating the address with id ${addressId}. Error Message: ${error}`);
        }
    }

    async deleteAddressById(addressId) {
        try {
            const deletedAddress = await Address.destroy({ where: { id: addressId } });
            if (deletedAddress) return deletedAddress;
            return null;
        } catch (error) {
            console.log(`Error Sever: Has been an error deleting the address with id ${addressId}. Error Message: ${error}`);
        }
    }   

}

export default Address;