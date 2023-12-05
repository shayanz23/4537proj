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

        console.log('Users retrieved successfully:', users);
        res.json(users);
    } catch (error) {
        console.error('Error getting users', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = adminRoutes;
