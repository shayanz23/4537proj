const express = require('express');
const adminRoutes = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('../../tokenHelpers/tokenHelper')


adminRoutes.get('/getAllUsers', async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('users').get();

        const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
        res.json(users);
    } catch (error) {
        console.error('Error getting users', error);
        res.status(500).send('Internal Server Error');
    }
});


adminRoutes.delete('/deleteUser', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;

        const userSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }


        const userId = userSnapshot.docs[0].id;
        await admin.firestore().collection('users').doc(userId).delete();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = adminRoutes;
