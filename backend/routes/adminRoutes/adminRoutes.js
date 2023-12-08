
/**
 * @swagger
 * 
 * /API/v1/admin/getAllUsers:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/admin/deleteUser:
 *   delete:
 *     summary: Delete a user by username (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/admin/addUser:
 *   post:
 *     summary: Add a new user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               isAdmin:
 *                 type: boolean
 *             required:
 *               - username
 *               - password
 *               - admin
 *     responses:
 *       200:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/admin/getAllEndpoints:
 *   get:
 *     summary: Get all endpoints (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all endpoints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endpoints:
 *                   type: array
 *                   items:
 *       500:
 *         description: Internal Server Error
 * 
 * /API/v1/admin/modifyUser/{userId}:
 *   put:
 *     summary: Modify a user by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
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
 *               admin:
 *                 type: boolean
 *             required:
 *               - username
 *               - password
 *               - admin
 *     responses:
 *       200:
 *         description: User modified successfully
 *       400:
 *         description: Username already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */


const express = require('express');
const adminRoutes = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { authenticateTokenAdmin, passwordEncoder } = require('../../tokenHelpers/tokenHelper');
const { updateRequestCount } = require("../helpers/helper")

adminRoutes.get('/getAllUsers', authenticateTokenAdmin, async (req, res) => {
  try {
    await updateRequestCount('getAllUsers');

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

adminRoutes.delete('/deleteUser', authenticateTokenAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    await updateRequestCount('deleteUser');

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

adminRoutes.post('/addUser', authenticateTokenAdmin, async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    await updateRequestCount('addUser');
    const existingUserSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();
    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const encodedPassword = passwordEncoder(password)

    const newUserRef = await admin.firestore().collection('users').add({
      username,
      password: encodedPassword,
      admin: isAdmin || false,
      calls: 0,
    });

    res.json({ message: 'User added successfully', userId: newUserRef.id });
  } catch (error) {
    console.error('Error adding user', error);
    res.status(500).send('Internal Server Error');
  }
});

adminRoutes.get('/getAllEndpoints', authenticateTokenAdmin, async (req, res) => {
  try {
    await updateRequestCount('getAllEndpoints');
    const endpointsCollection = await admin.firestore().collection('endpoints').get();

    const endpoints = [];
    endpointsCollection.forEach((doc) => {
      endpoints.push(doc.data());
    });

    res.json({ endpoints });
  } catch (error) {
    console.error('Error getting endpoints', error);
    res.status(500).send('Internal Server Error');
  }
})

adminRoutes.put('/modifyUser/:userId', authenticateTokenAdmin, async (req, res) => {
  try {
    const { username, isAdmin } = req.body;
    const userId = req.params.userId;
    await updateRequestCount('modifyUser');
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) {
      const existingUserSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();
      if (!existingUserSnapshot.empty && existingUserSnapshot.docs[0].id !== userId) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const updatedData = {};
    if (username !== undefined) {
      updatedData.username = username;
    }
    if (isAdmin !== undefined) {
      updatedData.admin = isAdmin;
    }

    await userDocRef.update(updatedData);

    res.json({ message: 'User modified successfully' });
  } catch (error) {
    console.error('Error modifying user', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = adminRoutes;
