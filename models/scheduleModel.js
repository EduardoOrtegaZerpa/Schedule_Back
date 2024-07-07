const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Schedule = sequelize.define('schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hall: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'schedule',
    timestamps: false
});


module.exports = {Schedule};