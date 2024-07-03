const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const { RoleEnum } = require('../config/enum');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(RoleEnum)),
        allowNull: false
    },
}, {
    tableName: 'user',
    timestamps: false
});



module.exports = {User};