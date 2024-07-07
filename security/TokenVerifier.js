const jwt = require("jsonwebtoken");

class TokenVerifier {

    constructor(secretKey, refreshTokenSecretKey) {
        this.secretKey = secretKey;
        this.refreshTokenSecretKey = refreshTokenSecretKey;
    }

    verifyAccessToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretKey, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    verifyRefreshToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.refreshTokenSecretKey, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}

module.exports = TokenVerifier;