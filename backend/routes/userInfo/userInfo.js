const express = require('express');
const jwt = require('jsonwebtoken');
const userInfo = express.Router();
const admin = require('firebase-admin');
const { tokenGenerator, passwordDecoder, passwordEncoder, authenticateToken } = require('../../tokenHelpers/tokenHelper');

userInfo.get('/getCalls', authenticateToken, async (req, res) => {
    try {
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

userInfo.put('/upCallCount', authenticateToken, async (req, res) => {
    try {
        const userUid = req.user.uid;

        const userDocRef = admin.firestore().collection('users').doc(userUid);

        // Use Firestore transaction to ensure atomicity
        await admin.firestore().runTransaction(async (transaction) => {
            const userSnapshot = await transaction.get(userDocRef);

            if (!userSnapshot.exists) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userData = userSnapshot.data();
            const newCallsCount = (userData.calls || 0) + 1;

            // Update the calls count in the document
            transaction.update(userDocRef, { calls: newCallsCount });
            res.json({ calls: newCallsCount });
        });
    } catch (error) {
        console.error('Error updating user calls count', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = userInfo;