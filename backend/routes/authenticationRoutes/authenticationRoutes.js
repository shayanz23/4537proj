const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const admin = require('firebase-admin');
const { tokenGenerator, passwordDecoder, passwordEncoder } = require('../../tokenHelpers/tokenHelper');
const {updateRequestCount} = require('../helpers/helper')

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        await updateRequestCount('/register');

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

        await updateRequestCount('/login');
        
        const { username, password } = req.body;
        console.log(username)
        console.log(password)

        const userSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const userDoc = userSnapshot.docs[0];

        const accessToken = tokenGenerator(userDoc.id);
    
        const user = userDoc.data();
        const decodedPassword = jwt.verify(user.password, process.env.PASSWORD_CODER);
        if (decodedPassword.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.cookie('access_token', accessToken, { httpOnly: true });

        res.json({ message: 'Logged in', accessToken, calls: user.calls });
    } catch (error) {
        console.error('Authentication error', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

