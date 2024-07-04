const express = require('express');
const router = express.Router();
const subjectController = require('./controllers/subjectController');
const groupController = require('./controllers/groupController');
const scheduleController = require('./controllers/scheduleController');
const userController = require('./controllers/userController');
const degreeController = require('./controllers/degreeController');
const tokenManager = require('./security/TokenManager');


// USER
router.post('/login', userController.login);
router.get('/validate', userController.validateCookie);

// DEGREE
router.get('/degrees', degreeController.getAllDegrees);
router.get('/degrees/:id', degreeController.getDegreeById);
router.post('/degrees', tokenManager.verifyTokenMiddleware(), degreeController.createDegree);
router.put('/degrees/:id', tokenManager.verifyTokenMiddleware(), degreeController.updateDegree);
router.delete('/degrees/:id', tokenManager.verifyTokenMiddleware(), degreeController.deleteDegree);
router.get('/degrees/:id/subjects', degreeController.getSubjectsByDegree);


// SUBJECT
router.get('/subjects', subjectController.getAllSubjects);
router.get('/subjects/:id', subjectController.getSubjectById);
router.post('/subjects/:degreeId', tokenManager.verifyTokenMiddleware(), subjectController.createSubject);
router.put('/subjects/:id', tokenManager.verifyTokenMiddleware(), subjectController.updateSubject);
router.delete('/subjects/:id', tokenManager.verifyTokenMiddleware(), subjectController.deleteSubject);
router.get('/subjects/:id/groups', subjectController.getGroupsBySubject);


// GROUP
router.get('/groups', groupController.getAllGroups);
router.get('/groups/:id', groupController.getGroupById);
router.post('/groups/:id', tokenManager.verifyTokenMiddleware(), groupController.createGroup);
router.put('/groups/:id', tokenManager.verifyTokenMiddleware(), groupController.updateGroup);
router.delete('/groups/:id', tokenManager.verifyTokenMiddleware(), groupController.deleteGroup);
router.get('/groups/:id/schedules', groupController.getSchedulesByGroup);


// SCHEDULE
router.get('/schedules', scheduleController.getAllSchedules);
router.get('/schedules/:id', scheduleController.getScheduleById);
router.post('/schedules/:id', tokenManager.verifyTokenMiddleware(), scheduleController.createSchedule);
router.put('/schedules/:id', tokenManager.verifyTokenMiddleware(), scheduleController.updateSchedule);
router.delete('/schedules/:id', tokenManager.verifyTokenMiddleware(), scheduleController.deleteSchedule);












module.exports = router;