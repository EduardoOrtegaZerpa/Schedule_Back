const { Group } = require('../models/groupModel');
const { Schedule } = require('../models/scheduleModel');


const groupController = {

    getAllGroups: async (req, res) => {
        try {
            const groups = await Group.findAll();
            res.json({response: groups, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getGroupById: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (group) {
                res.json({response: group, result: true});
            } else {
                res.status(404).send({error: 'Group not found', response: null, result: false});
            }
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getSchedulesByGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (!group) {
                return res.status(404).send({error: 'Group not found', response: null, result: false});
            }

            const schedules = await Schedule.findAll({
                where: {
                    group_id: req.params.id
                }
            });

            res.json({response: schedules, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    createGroup: async (req, res) => {
        try {
            const group = req.body;
            const subjectId = req.params.id;

            const existingGroup = await Group.findOne({
                where: {
                    name: group.name,
                    subject_id: subjectId
                }
            });

            if (existingGroup) {
                return res.status(400).send({error: 'Group already exists', response: null, result: false});
            }

            const newGroup = await Group.create(group);

            res.json({response: newGroup, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    updateGroup: async (req, res) => {
        try {
            const group = req.body;

            const existingGroup = await Group.findByPk(req.params.id);

            if (!existingGroup) {
                return res.status(404).send({error: 'Group not found', response: null, result: false});
            }

            await existingGroup.update(group);

            res.json({response: group, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    deleteGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);

            if (!group) {
                return res.status(404).send({error: 'Group not found', response: null, result: false});
            }

            await group.destroy();

            res.json({result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }

};


module.exports = groupController;