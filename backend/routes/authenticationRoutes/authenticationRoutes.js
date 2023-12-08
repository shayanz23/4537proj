/**
 * @swagger
 * 
 * /API/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 calls:
 *                   type: number
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/auth/login:
 *   post:
 *     summary: Login and generate access tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 adminAccessToken:
 *                   type: string
 *                 calls:
 *                   type: number
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal Server Error
 */


const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const admin = require('firebase-admin');
const { tokenGenerator, passwordDecoder, passwordEncoder, tokenGeneratorAdmin } = require('../../tokenHelpers/tokenHelper');
const {updateRequestCount} = require('../helpers/helper')

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        await updateRequestCount('register');

        const encodedPassword = passwordEncoder(password);

        const existingUserSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const userDocRef = await admin.firestore().collection('users').add({
            username,
            password: encodedPassword,
            calls: 0,
            admin: false,
        });

        const accessToken = tokenGenerator(userDocRef.id);
        res.cookie('access_token', accessToken, { httpOnly: true });
        
        res.json({ message: 'User registered successfully', accessToken, calls: 0 });
    } catch (error) {
        console.error('Registration error', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        await updateRequestCount('login');
        
        const { username, password } = req.body;

        const userSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();

        let accessToken;
        let adminAccessToken;

        if (user.admin === true) {
            accessToken = tokenGenerator(userDoc.id);
            adminAccessToken = tokenGeneratorAdmin(userDoc.id);
        } else {
            accessToken = tokenGenerator(userDoc.id);
            adminAccessToken = null;
        }

        const decodedPassword = jwt.verify(user.password, process.env.PASSWORD_CODER);
        if (decodedPassword.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });   
        }

        res.cookie('access_token', accessToken, { httpOnly: true });
        if (adminAccessToken) {
            res.cookie('admin_access_token', adminAccessToken, { httpOnly: true });
        }

        res.json({ message: 'Logged in', accessToken, adminAccessToken, calls: user.calls });
    } catch (error) {
        console.error('Authentication error', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;

