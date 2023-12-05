const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if (token == null) {
        console.log('its null')
        return res.sendStatus(401);
    }
    console.log('in authToken',jwt.verify(token, process.env.ACCESS_TOKEN_SECRET))
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) { return res.sendStatus(403); }
        const { iat, ...userWithoutIAT } = user;
        req.user = userWithoutIAT;
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
