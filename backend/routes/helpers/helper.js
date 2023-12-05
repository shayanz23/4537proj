const admin = require('firebase-admin');

const updateRequestCount = async (endpointName) => {
    try {
      const endpointRef = admin.firestore().collection('endpoints').doc(endpointName);
      const endpointDoc = await endpointRef.get();
  
      if (!endpointDoc.exists) {
        // If the endpoint document doesn't exist, create it with calls initialized to 0
        await endpointRef.set({ calls: 0 });
      } else {
        // If the endpoint document exists, update the calls count
        await endpointRef.update({ calls: admin.firestore.FieldValue.increment(1) });
      }
    } catch (error) {
      console.error('Error updating request count', error);
    }
  };

module.exports = {updateRequestCount};