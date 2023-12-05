const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const admin = require('firebase-admin');
const {tokenGenerator, passwordDecoder, passwordEncoder} = require('../../tokenHelpers/tokenHelper')



router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const encodedPassword = passwordEncoder(password);

        const existingUserSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (!existingUserSnapshot.empty) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        await admin.firestore().collection('users').add({
            username,
            password: encodedPassword,
            calls: 0,      
            admin: false, 
        });

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = userSnapshot.docs[0].data();

        const decodedPassword = jwt.verify(user.password, process.env.PASSWORD_CODER);

        if (decodedPassword !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const accessToken = tokenGenerator(user.uid);
        res.json({ message: 'Logged in', accessToken });
    } catch (error) {
        console.error('Authentication error', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;