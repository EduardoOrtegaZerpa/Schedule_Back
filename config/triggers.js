const {Op} = require('sequelize');
const {Subject} = require('../models/subjectModel');
const {Degree} = require('../models/degreeModel');

const setupTriggers = () => {

    Subject.beforeCreate(async (subject, options) => {
        await checkYearIsNotHigherThanDegree(subject);
        await checkSemesterValue(subject);
    });

    Subject.beforeUpdate(async (subject, options) => {
        await checkYearIsNotHigherThanDegree(subject);
        await checkSemesterValue(subject);
    });
}

async function checkYearIsNotHigherThanDegree(subject) {
    const degree = await Degree.findByPk(subject.degree_id);

    if (subject.year > degree.years) {
        throw new Error('Year is higher than degree duration');
    }
}

async function checkSemesterValue(subject) {
    if (subject.semester < 1 || subject.semester > 2) {
        throw new Error('Semester value is not valid');
    }
}

module.exports = {setupTriggers};