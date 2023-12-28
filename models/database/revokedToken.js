import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js'; // Ajusta la importación según tu estructura

const RevokedToken = sequelize.define('revokedToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    revokedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export { RevokedToken };
