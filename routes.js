const express = require('express');
const router = express.Router();
const subjectController = require('./controllers/subjectController');
const groupController = require('./controllers/groupController');
const scheduleController = require('./controllers/scheduleController');
const userController = require('./controllers/userController');
const degreeController = require('./controllers/degreeController');
const tokenManager = require('./security/TokenManager');


// USER
router.post('/user', userController.login);

// DEGREE
router.get('/degree', degreeController.getAllDegrees);
router.get('/degree/:id', degreeController.getDegreeById);
router.post('/degree', tokenManager.verifyTokenMiddleware(), degreeController.createDegree);
router.put('/degree/:id', tokenManager.verifyTokenMiddleware(), degreeController.updateDegree);
router.delete('/degree/:id', tokenManager.verifyTokenMiddleware(), degreeController.deleteDegree);

// SUBJECT
router.get('/subject', subjectController.getAllSubjects);
router.get('/subject/:id', subjectController.getSubjectById);
router.get('/subject/degree/:id', subjectController.getSubjectsByDegree);
router.post('/subject/:degreeId', tokenManager.verifyTokenMiddleware(), subjectController.createSubject);
router.put('/subject/:id', tokenManager.verifyTokenMiddleware(), subjectController.updateSubject);
router.delete('/subject/:id', tokenManager.verifyTokenMiddleware(), subjectController.deleteSubject);

// GROUP
router.get('/group', groupController.getAllGroups);
router.get('/group/:id', groupController.getGroupById);
router.get('/group/subject/:id', groupController.getGroupsBySubject);
router.post('/group/:id', tokenManager.verifyTokenMiddleware(), groupController.createGroup);
router.put('/group/:id', tokenManager.verifyTokenMiddleware(), groupController.updateGroup);
router.delete('/group/:id', tokenManager.verifyTokenMiddleware(), groupController.deleteGroup);

// SCHEDULE
router.get('/schedule', scheduleController.getAllSchedules);
router.get('/schedule/:id', scheduleController.getScheduleById);
router.get('/schedule/group/:id', scheduleController.getSchedulesByGroup);
router.post('/schedule/:id', tokenManager.verifyTokenMiddleware(), scheduleController.createSchedule);
router.put('/schedule/:id', tokenManager.verifyTokenMiddleware(), scheduleController.updateSchedule);
router.delete('/schedule/:id', tokenManager.verifyTokenMiddleware(), scheduleController.deleteSchedule);












module.exports = router;