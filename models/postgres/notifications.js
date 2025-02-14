import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { User } from './user.js';

export const Notifications = sequelize.define('notifications', {
    specialOffers: {
        type: DataTypes.ENUM('SMS', 'EMAIL'),
        defaultValue: null,
        allowNull: true,
    },
    newCollections: {
        type: DataTypes.ENUM('SMS', 'EMAIL'),
        defaultValue: null,
        allowNull: true,
    },
    shoppingCartReminder: {
        type: DataTypes.ENUM('SMS', 'EMAIL'),
        defaultValue: null,
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
});

Notifications.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
User.hasMany(Notifications, { foreignKey: 'userId', sourceKey: 'id' });

export class NotificationsModel {

    async addNotificationToUser (notificationData)  {
        try {
            const newNotification = await Notifications.create({
                ...notificationData,
            });
            return newNotification;
        } catch (error) {
            console.log(error);
        }
    };

    async getNotificationsByUserId (userLoggedId) {
        try {
            const notifications = await Notifications.findAll({
                where: { userId: userLoggedId },
                order: [['createdAt', 'DESC']],
            });
            const { updatedAt, createdAt, userId, ...notificationInfo } = notifications[0].dataValues;
            return notificationInfo;
        } catch (error) {
            console.log(`Error Sever: Has been an error getting the notifications with userId ${userLoggedId}. Error Message: ${error}`);
        }
    }

    async updateNotificationById (notificationId, updatedNotification) {
        try {
            const [updatedRowCount, updatedNotificationRecords] = await Notifications.update(updatedNotification, {
                where: { userId: notificationId },
                returning: true,
            });
            if (updatedRowCount === 0) return null;
            if (Array.isArray(updatedNotificationRecords) && updatedNotificationRecords.length > 0) return updatedNotificationRecords[0];
            return null;
        } catch (error) {
            console.log(`Server error: There has been an error updating the notification with id ${notificationId}. Error Message: ${error}`);
        }
    }

}

