const express = require('express');
const jwt = require('jsonwebtoken');
const userInfo = express.Router();
const admin = require('firebase-admin');
const { tokenGenerator, passwordDecoder, passwordEncoder, authenticateToken } = require('../../tokenHelpers/tokenHelper');
const { updateRequestCount } = require('../helpers/helper')

userInfo.get('/getCalls', authenticateToken, async (req, res) => {
    try {
        await updateRequestCount('getCalls')
        const userId = req.user.uid;

        const userSnapshot = await admin.firestore().collection('users').doc(userId).get();

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


// CHATGPT WAS USED IN THIS ENDPOINT
userInfo.put('/upCallCount', authenticateToken, async (req, res) => {
    try {
        await updateRequestCount('upCallCount')
        const userUid = req.user.uid;

        const userDocRef = admin.firestore().collection('users').doc(userUid);

        await userDocRef.update({ calls: admin.firestore.FieldValue.increment(1) });
    } catch (error) {
        console.error('Error updating user calls count', error);
        res.status(500).send('Internal Server Error');
    }
});

userInfo.get('/getUserName', authenticateToken, async (req, res) => {
    try {

        await updateRequestCount('getUserName')
        const userUid = req.user.uid;

        const userSnapshot = await admin.firestore().collection('users').doc(userUid).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.data();
        const username = userData.username;

        res.json({ username });
    } catch (error) {
        console.error('Error getting username', error);
        res.status(500).send('Internal Server Error');
    }
});

userInfo.get('/getAdminStatus', authenticateToken, async (req, res) => {
    try {
        await updateRequestCount('getAdminStatus')
        const userUid = req.user.uid;

        const userSnapshot = await admin.firestore().collection('users').doc(userUid).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.data();
        const adminStatus = userData.admin;

        res.json({ adminStatus });
    } catch (error) {
        console.error('Error getting username', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = userInfo;