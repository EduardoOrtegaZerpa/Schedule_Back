const { response } = require('express');
const {Degree} = require('../models/degreeModel');

const degreeController = {

    getAllDegrees: async (req, res) => {
        try {
            const degrees = await Degree.findAll();
            res.json({response: degrees, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getDegreeById: async (req, res) => {
        try {
            const degree = await Degree.findByPk(req.params.id);
            if (degree) {
                res.json({response: degree, result: true});
            } else {
                res.status(404).send({error: 'Degree not found', response: null, result: false});
            }
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    createDegree: async (req, res) => {
        try {
            const degree = req.body;

            const existingDegree = await Degree.findOne({
                where: {
                    name: degree.name
                }
            });

            if (existingDegree) {
                return res.status(400).send({error: 'Degree already exists', response: null, result: false});
            }

            await Degree.create({response: degree, result: true});

            res.json(degree);
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    updateDegree: async (req, res) => {
        try {
            const degree = req.body;

            const existingDegree = await Degree.findByPk(req.params.id);

            if (!existingDegree) {
                return res.status(404).send({error: 'Degree not found', response: null, result: false});
            }

            await existingDegree.update(degree);

            res.json({response: degree, result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    deleteDegree: async (req, res) => {
        try {
            const degree = await Degree.findByPk(req.params.id);

            if (!degree) {
                return res.status(404).send({error: 'Degree not found', response: null, result: false});
            }

            await degree.destroy();

            res.json({result: true});
        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }


};


module.exports = degreeController;