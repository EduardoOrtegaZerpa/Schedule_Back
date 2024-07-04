const {Schedule} = require('../models/scheduleModel');


const scheduleController = {

    getAllSchedules: async (req, res) => {
        try {
            const schedules = await Schedule.findAll();
            res.json({response: schedules, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getScheduleById: async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(req.params.id);
            if (schedule) {
                res.json({response: schedule, result: true});
            } else {
                res.status(404).send({error: 'Schedule not found', response: null, result: false});
            }
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getSchedulesByGroup: async (req, res) => {
        try {
            const schedules = await Schedule.findAll({
                where: {
                    group_id: req.params.id
                }
            });

            if (schedules.length === 0) {
                res.status(404).send({error: 'Schedules not found', response: null, result: false});
            }

            res.json({response: schedules, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    createSchedule: async (req, res) => {
        try {
            const schedule = req.body;
            const groupId = req.params.id;

            const existingSchedule = await Schedule.findOne({
                where: {
                    startTime: schedule.startTime &&
                    schedule.endTime === schedule.endTime &&
                    schedule.day === schedule.day &&
                    schedule.group_id === groupId
                }
            });

            if (existingSchedule) {
                return res.status(400).send({error: 'Schedule already exists', response: null, result: false});
            }

            await Schedule.create(schedule);

            res.json({response: schedule, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    updateSchedule: async (req, res) => {
        try {
            const schedule = req.body;

            const existingSchedule = await Schedule.findByPk(req.params.id);

            if (!existingSchedule) {
                return res.status(404).send({error: 'Schedule not found', response: null, result: false});
            }

            await existingSchedule.update(schedule);

            res.json({response: schedule, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    deleteSchedule: async (req, res) => {
        try {
            const existingSchedule = await Schedule.findByPk(req.params.id);

            if (!existingSchedule) {
                return res.status(404).send({error: 'Schedule not found', response: null, result: false});
            }

            await existingSchedule.destroy();

            res.json({result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }
};


module.exports = scheduleController;