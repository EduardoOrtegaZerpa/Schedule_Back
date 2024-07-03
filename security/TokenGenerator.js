const jwt = require("jsonwebtoken");

class TokenGenerator {
    constructor(secretKey, refreshTokenSecretKey, accessTokenExpiry = '1m', refreshTokenExpiry = '7d') {
        this.secretKey = secretKey;
        this.refreshTokenSecretKey = refreshTokenSecretKey;
        this.accessTokenExpiry = accessTokenExpiry;
        this.refreshTokenExpiry = refreshTokenExpiry;
    }

    generateAccessToken(payload) {
        return jwt.sign(payload, this.secretKey, {expiresIn: this.accessTokenExpiry});
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshTokenSecretKey, {expiresIn: this.refreshTokenExpiry});
    }

}

module.exports = TokenGenerator;