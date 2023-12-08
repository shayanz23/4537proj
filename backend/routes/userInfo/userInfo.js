/**
 * @swagger
 * 
 * /API/v1/userInfo/getCalls:
 *   get:
 *     summary: Get user call count
 *     tags: [UserInfo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User calls retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calls:
 *                   type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/userInfo/upCallCount:
 *   put:
 *     summary: Update user call count
 *     tags: [UserInfo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User call count updated successfully
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/userInfo/getUserName:
 *   get:
 *     summary: Get user username
 *     tags: [UserInfo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User username retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/userInfo/getAdminStatus:
 *   get:
 *     summary: Get user admin status
 *     tags: [UserInfo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User admin status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminStatus:
 *                   type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

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
        res.send(200);
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