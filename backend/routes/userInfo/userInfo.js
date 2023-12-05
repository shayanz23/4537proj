const express = require('express');
const jwt = require('jsonwebtoken');
const userInfo = express.Router();
const admin = require('firebase-admin');
const { tokenGenerator, passwordDecoder, passwordEncoder,authenticateToken } = require('../../tokenHelpers/tokenHelper');

userInfo.get('/getCalls', authenticateToken, async (req, res) => {
    try {
        const userUid = req.user.uid;

        const userSnapshot = await admin.firestore().collection('users').doc(userUid).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.data();
        res.json({ calls: userData.calls });
    } catch (error) {
        console.error('Error getting user calls', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = userInfo;