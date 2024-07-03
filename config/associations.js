const { Degree } = require('../models/degreeModel');
const { Subject } = require('../models/subjectModel');
const { Group } = require('../models/groupModel');
const { Schedule } = require('../models/scheduleModel');

const setupAssociations = () => {
    // -------------- DEGREE
    Degree.hasMany(Subject, {
        foreignKey: 'degree_id',
        sourceKey: 'id',
        onDelete: 'CASCADE'
    });

    Degree.hasMany(Group, {
        foreignKey: 'degree_id',
        sourceKey: 'id',
        onDelete: 'CASCADE'
    });

    // -------------- SUBJECT
    Subject.belongsTo(Degree, {
        foreignKey: 'degree_id',
        sourceKey: 'id'
    });

    Subject.hasMany(Group, {
        foreignKey: 'subject_id',
        sourceKey: 'id',
        onDelete: 'CASCADE'
    });

    // -------------- GROUP
    Group.belongsTo(Degree, {
        foreignKey: 'degree_id',
        sourceKey: 'id'
    });

    Group.belongsTo(Subject, {
        foreignKey: 'subject_id',
        sourceKey: 'id'
    });

    Group.hasMany(Schedule, {
        foreignKey: 'group_id',
        onDelete: 'CASCADE',
        sourceKey: 'id'
    });

    // -------------- SCHEDULE
    Schedule.belongsTo(Group, {
        foreignKey: 'group_id',
        sourceKey: 'id'
    });
}

module.exports = { setupAssociations };