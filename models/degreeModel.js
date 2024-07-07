const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Degree = sequelize.define('degree', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    years: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'degree',
    timestamps: false
});

module.exports = {Degree};