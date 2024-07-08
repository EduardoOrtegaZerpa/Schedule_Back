const { RoleEnum } = require('../config/enum');
const { User } = require('../models/userModel');
const { Subject } = require('../models/subjectModel');
const { Group } = require('../models/groupModel');
const { Schedule } = require('../models/scheduleModel');
const tokenManager = require('../security/TokenManager');
const {spawn} = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const scriptPath = path.resolve(__dirname, '../../ALGORITHM/algorithm.py');
if (!fs.existsSync(scriptPath)) {
    console.error('El archivo del script de Python no existe en la ruta proporcionada.');
    return;
}

const boundScriptPath = path.resolve(__dirname, '../../ALGORITHM/boundAlgorithm.py');
if (!fs.existsSync(boundScriptPath)) {
    console.error('El archivo del script de Python no existe en la ruta proporcionada.');
    return;
}

const dayIndexMap = {
    'monday': 0,
    'tuesday': 1,
    'wednesday': 2,
    'thursday': 3,
    'friday': 4,
    'saturday': 5,
    'sunday': 6
};

function formatOutput(data) {
    const headerRegex = /(\d+), (\d+.\d+), \[/;
    const headerMatch = data.match(headerRegex);

    if (!headerMatch) {
        return {
            days: 0,
            hours: 0,
            subjects: []
        }
    }

    const [, day, freeHours] = headerMatch;

    const subjectRegex = /\[(\d+), \[(\d+)(?:,\d+)*\]\]/g;
    let match;
    const subjects = [];

    while ((match = subjectRegex.exec(data)) !== null) {
        subjects.push({
            subject: parseInt(match[1]),
            group: parseInt(match[2])
        });
    }

    return {
        days: parseInt(day),
        hours: parseFloat(freeHours),
        subjects: subjects
    };
}

const getGroupData = async (groupId) => {
    const group = await Group.findByPk(groupId);

    if (!group) {
        return null;
    }

    const schedules = await Schedule.findAll({
        where: {
            group_id: groupId
        }
    });

    const days = schedules.map(schedule => schedule.day);

    const uniqueDays = days.filter((day, index) => days.indexOf(day) === index);
    const uniqueDaysIndexed = uniqueDays.map(day => dayIndexMap[day]);

    const schedule = uniqueDaysIndexed.map(index => {
        const daySchedules = schedules.filter(schedule => dayIndexMap[schedule.day] === index);
        const daySchedule = daySchedules.map(schedule => {
            const startTimeDate = schedule.startTime;
            const endTimeDate = schedule.endTime;
            return {
                startTime: {
                    hour: startTimeDate.getHours(),
                    minute: startTimeDate.getMinutes()
                },
                endTime: {
                    hour: endTimeDate.getHours(),
                    minute: endTimeDate.getMinutes()
                }
            }
        });

        return {
            day: index,
            schedules: daySchedule
        }
    })

    return schedule;
}

const getSubjectData = async (subjectId) => {

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
        return null;
    }

    const groups = await Group.findAll({
        where: {
            subject_id: subjectId
        },
        include: {
            model: Schedule,
            required: true
        }
    });

    if (!groups || groups.length === 0) {
        return null;
    }

    const formatSubject = await Promise.all(groups.map(async (group) => {
        const schedules = await getGroupData(group.id);

        return {
            name: subject.id,
            groups: [group.id],
            schedule: schedules
        };
    }))

    return formatSubject;
};
    

const executePythonScript = async (subjects) => {
    const formatSubjects = JSON.stringify(subjects);
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, formatSubjects]);
        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data;
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}`));
            } else {
                resolve(result);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
};

const executePythonBoundScript = async (subjects, days, hours) => {
    const formatSubjects = JSON.stringify(subjects);
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [boundScriptPath, formatSubjects, days, hours]);
        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data;
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}`));
            } else {
                resolve(result);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
};


const userController = {
    
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            const user = await User.findOne({
                where: {
                    username,
                    passwordHash: hashedPassword
                }
            });

            if (!user) {
                return res.status(401).send({error: 'Invalid credentials', response: null, result: false});
            }

            const accessToken = tokenManager.tokenGenerator.generateAccessToken({userId: user.id, role: user.role});
            const refreshToken = tokenManager.tokenGenerator.generateRefreshToken({userId: user.id, role: user.role});

            res.cookie('accessToken', accessToken, {httpOnly: true});
            res.cookie('refreshToken', refreshToken, {httpOnly: true});

            res.status(200).send({response: user, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getNonOverlappedSchedule: async (req, res) => {
        try {
            const { subjectIds } = req.body;

            const subjects = await Subject.findAll({
                where: {
                    id: subjectIds
                }
            });

            if (!subjects) {
                return res.status(404).send({error: 'Subjects not found', response: null, result: false});
            }

            let subjectsData = await Promise.all(subjects.map(async (subject) => getSubjectData(subject.id)));

            subjectsData = subjectsData.filter(subject => subject !== null);

            if (subjectsData.length === 0) {
                return res.status(404).send({error: 'Groups not found', response: null, result: false});
            }

            const result = await executePythonScript(subjectsData.flat());

            const formattedResult = formatOutput(result);

            if (!formattedResult) {
                return res.status(500).send({error: 'Error formatting result', response: null, result: false});
            }

            res.status(200).send({response: formattedResult, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    getNonOverlappedScheduleWithBound: async (req, res) => {
        try {
            const { subjectIds } = req.body;
            const { days, hours } = req.params;

            const subjects = await Subject.findAll({
                where: {
                    id: subjectIds
                }
            });

            if (!subjects) {
                return res.status(404).send({error: 'Subjects not found', response: null, result: false});
            }

            let subjectsData = await Promise.all(subjects.map(async (subject) => getSubjectData(subject.id)));

            subjectsData = subjectsData.filter(subject => subject !== null);

            if (subjectsData.length === 0) {
                return res.status(404).send({error: 'Groups not found', response: null, result: false});
            }

            const result = await executePythonBoundScript(subjectsData.flat(), days, hours);

            const formattedResult = formatOutput(result);

            if (!formattedResult) {
                return res.status(500).send({error: 'Error formatting result', response: null, result: false});
            }

            res.status(200).send({response: formattedResult, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    },

    validateCookie: async (req, res) => {
        try {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            if (!accessToken || !refreshToken) {
                return res.status(401).send({error: 'Unauthorized', response: null, result: false});
            }

            const accessTokenPayload = await tokenManager.tokenVerifier.verifyAccessToken(accessToken);
            const refreshTokenPayload = await tokenManager.tokenVerifier.verifyRefreshToken(refreshToken);

            if (!accessTokenPayload || !refreshTokenPayload) {
                return res.status(401).send({error: 'Unauthorized', response: null, result: false});
            }

            const user = await User.findByPk(accessTokenPayload.userId);

            if (!user) {
                return res.status(401).send({error: 'Unauthorized', response: null, result: false});
            }

            res.status(200).send({result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }
};


module.exports = userController;
