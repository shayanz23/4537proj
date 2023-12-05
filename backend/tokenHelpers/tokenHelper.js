const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Token is missing');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            console.error('Error verifying token:', error);
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

const passwordEncoder = (password) => {
    try {
        return jwt.sign({ password }, process.env.PASSWORD_CODER);
    } catch (error) {
        console.error('Error encoding password:', error);
        return null;
    }
};

const passwordDecoder = (encodedPassword) => {
    try {
        const decoded = jwt.verify(encodedPassword, process.env.PASSWORD_CODER);
        return decoded.password;
    } catch (error) {
        console.error('Error decoding password:', error);
        return null;
    }
};

const tokenGenerator = (uid) => {
    const user = { uid };
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return token;
};

module.exports = { authenticateToken, passwordEncoder, passwordDecoder, tokenGenerator };
