const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const serviceAccount = require('./firebase/credentials.json');
const adminRoutes = require('../backend/routes/adminRoutes/adminRoutes');
const authRoutes = require('../backend/routes/authenticationRoutes/authenticationRoutes');
const userInfo = require('../backend/routes/userInfo/userInfo')

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.status(403).send('HTTPS required');
    }
    next();
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/userInfo', userInfo);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
