const {Op} = require('sequelize');
const {Subject} = require('../models/subjectModel');
const {Degree} = require('../models/degreeModel');
const {Schedule} = require('../models/scheduleModel');

const setupTriggers = () => {

    Subject.beforeCreate(async (subject, options) => {
        await checkYearIsNotHigherThanDegree(subject);
        await checkSemesterValue(subject);
    });

    Subject.beforeUpdate(async (subject, options) => {
        await checkYearIsNotHigherThanDegree(subject);
        await checkSemesterValue(subject);
    });

    Schedule.beforeCreate(async (schedule, options) => {
        await checkScheduleHoursDoesNotOverlap(schedule);
    });

    Schedule.beforeUpdate(async (schedule, options) => {
        await checkScheduleHoursDoesNotOverlap(schedule);
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

async function checkScheduleHoursDoesNotOverlap(schedule) {
    const schedules = await Schedule.findAll({
        where: {
            group_id: schedule.group_id,
            day: schedule.day,
            id: {
                [Op.ne]: schedule.id
            },
            [Op.or]: [
                {
                    startTime: {
                        [Op.gt]: schedule.startTime,
                        [Op.lt]: schedule.endTime
                    }
                },
                {
                    endTime: {
                        [Op.gt]: schedule.startTime,
                        [Op.lt]: schedule.endTime
                    }
                }
            ]
        }
    });

    if (schedules.length > 0) {
        throw new Error('Schedule overlaps with another schedule');
    }
}

module.exports = {setupTriggers};