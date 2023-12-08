const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const serviceAccount = require('./firebase/credentials.json');
const adminRoutes = require('../backend/routes/adminRoutes/adminRoutes');
const authRoutes = require('../backend/routes/authenticationRoutes/authenticationRoutes');
const userInfo = require('../backend/routes/userInfo/userInfo')

const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.status(403).send('HTTPS required');
    }
    next();
});

app.use('/API/V1/admin', adminRoutes);
app.use('/API/V1/auth', authRoutes);
app.use('/API/V1/userInfo', userInfo);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Unhinged AI api documentation.",
            version: "1.0"
        },
        servers: [
            {
                url: "http://localhost:3000/"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ["./routes/*/*.js"]
}

const spacs = swaggerjsdoc(options);
app.use(
    "/API/swagger",
    swaggerUi.serve,
    swaggerUi.setup(spacs)
);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
