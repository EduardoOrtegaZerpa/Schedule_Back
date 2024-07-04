const { RoleEnum } = require('../config/enum');
const { User } = require('../models/userModel');
const tokenManager = require('../security/TokenManager');


const userController = {
    
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            const user = await User.findOne({
                where: {
                    username,
                    password: hashedPassword
                }
            });

            if (!user) {
                return res.status(401).send({error: 'Invalid credentials', response: null, result: false});
            }

            const accessToken = tokenManager.tokenGenerator.generateAccessToken({userId: user.id, role: user.role});
            const refreshToken = tokenManager.tokenGenerator.generateRefreshToken({userId: user.id, role: user.role});

            res.cookie('accessToken', accessToken, {httpOnly: true, secure: true, sameSite: 'none'});
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, sameSite: 'none'});

            res.status(200).send({response: user, result: true});

        } catch (error) {
            res.status(500).send({error: error.message, response: null, result: false});
        }
    }
};


module.exports = userController;
