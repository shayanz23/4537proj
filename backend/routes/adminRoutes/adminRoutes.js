const express = require('express');
const adminRoutes = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { authenticateToken, authenticateTokenAdmin, passwordEncoder } = require('../../tokenHelpers/tokenHelper');
const {updateRequestCount} = require("../helpers/helper")

adminRoutes.get('/getAllUsers', async (req, res) => {
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


module.exports = adminRoutes, updateRequestCount;
