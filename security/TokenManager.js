const TokenGenerator = require("./TokenGenerator");
const TokenVerifier = require("./TokenVerifier");
const crypto = require('crypto');

require('dotenv').config();

class TokenManager {

    constructor(secretKey = crypto.randomBytes(64).toString('hex'),
                refreshTokenSecretKey = crypto.randomBytes(64).toString('hex')) {
        this.tokenGenerator = new TokenGenerator(secretKey, refreshTokenSecretKey);
        this.tokenVerifier = new TokenVerifier(secretKey, refreshTokenSecretKey);
    }

    refreshToken(accessToken, refreshToken) {
        return new Promise((resolve, reject) => {
            this.tokenVerifier.verifyRefreshToken(refreshToken)
                .then((decoded) => {
                    const newAccessToken = this.tokenGenerator.generateAccessToken({username: decoded.username});
                    resolve(newAccessToken);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    verifyTokenMiddleware() {
        return (req, res, next) => {
            const token = req.cookies.accessToken;

            if (!token) {
                return res.status(403).json({message: 'Token no proporcionado'});
            }

            this.tokenVerifier.verifyAccessToken(token)
                .then((decoded) => {
                    req.user = decoded;
                    next();
                })
                .catch((err) => {
                    if (err.name === 'TokenExpiredError') {
                        const refreshToken = req.cookies.refreshToken
                        if (!refreshToken) {
                            return res.status(401).json({message: 'Token caducado, inicie sesión nuevamente'});
                        }

                        this.refreshToken(token, refreshToken)
                            .then((newAccessToken) => {
                                res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: false});
                                return next();
                            })
                            .catch(() => {
                                return res.status(401).json({message: 'Token de actualización inválido'});
                            });
                    } else {
                        return res.status(401).json({message: 'Token inválido'});
                    }
                });
        };
    }

    refreshTokenMiddleware() {
        return (req, res, next) => {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            // Si no hay accessToken ni refreshToken no tiene sentido continuar
            if (!accessToken || !refreshToken) {
                console.log("Didn't find token. Proceeding with request")
                return next();
            }


            // Verificar validez del token de acceso
            this.tokenVerifier.verifyAccessToken(accessToken)
                .then(() => {
                    return next();
                })
                .catch((err) => {
                    if (err.name === 'TokenExpiredError') {
                        return next();
                    }

                    // Verificar validez del token de actualización
                    this.tokenVerifier.verifyRefreshToken(refreshToken)
                        .then(() => {
                            // Generar nuevo token de acceso
                            this.refreshToken(accessToken, refreshToken)
                                .then((newAccessToken) => {
                                    res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: false});
                                    return next();
                                })
                                .catch(() => {
                                    return next();
                                });
                        })
                        .catch(() => {
                            return next();
                        });
                });

        };
    }

}

const secretKey = process.env.TOKEN_SECRET_KEY;
const refreshTokenSecretKey = process.env.TOKEN_REFRESH_KEY;

// Crear una instancia de TokenManager con las claves secretas
const tokenManager = new TokenManager(secretKey, refreshTokenSecretKey);

module.exports = tokenManager;

