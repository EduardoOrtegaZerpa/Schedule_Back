const { Subject } = require('../models/subjectModel');
const { Group } = require('../models/groupModel');


const subjectController = {

    getAllSubjects: async (req, res) => {
        try {
            const subjects = await Subject.findAll();
            res.json({response: subjects, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getSubjectById: async (req, res) => {
        try {
            const subject = await Subject.findByPk(req.params.id);
            if (subject) {
                res.json({response: subject, result: true});
            } else {
                res.status(404).send({error: 'Subject not found', response: null, result: false});
            }
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getGroupsBySubject: async (req, res) => {
        try {
            const subject = await Subject.findByPk(req.params.id);
            if (!subject) {
                return res.status(404).send({error: 'Subject not found', response: null, result: false});
            }

            const groups = await Group.findAll({
                where: {
                    subject_id: req.params.id
                }
            });

            res.json({response: groups, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    createSubject: async (req, res) => {
        try {
            const subject = req.body;
            const degreeId = req.params.degreeId;

                const existingSubject = await Subject.findOne({
                    where: {
                        name: subject.name,
                        degree_id: degreeId
                    }
                });

            if (existingSubject) {
                return res.status(400).send({error: 'Subject already exists', response: null, result: false});
            }

            const newSubject = await Subject.create(subject);

            res.json({response: newSubject, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    updateSubject: async (req, res) => {
        try {
            const subject = req.body;

            const existingSubject = await Subject.findByPk(req.params.id);

            if (!existingSubject) {
                return res.status(404).send({error: 'Subject not found', response: null, result: false});
            }

            await existingSubject.update(subject);

            res.json({response: subject, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    deleteSubject: async (req, res) => {
        try {
            const subject = await Subject.findByPk(req.params.id);

            if (!subject) {
                return res.status(404).send({error: 'Subject not found', response: null, result: false});
            }

            await subject.destroy();

            res.json({result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }




};


module.exports = subjectController;