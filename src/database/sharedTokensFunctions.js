// Contains CRUD operations for the sharedTokens collection.

const db = require('./firebaseSetup');
const sharedTokensCollection = db.collection('servers');

const sharedTokensFunctions = {
  createSharedToken: async (tokenId, sharedTokenData) => {
    try {
      await sharedTokensCollection.doc(tokenId).set(sharedTokenData);
      console.log(`Shared token ${tokenId} created successfully.`);
    } catch (error) {
      console.error('Error creating shared token:', error);
      console.error('Error creating shared token:', error);
      console.error('Error creating shared token:', error);
      console.error('Error creating shared token:', error);
      console.error('Error creating shared token:', error);
    }
  },

  readSharedToken: async (tokenId) => {
    try {
      const doc = await sharedTokensCollection.doc(tokenId).get();
      if (doc.exists) {
        return doc.data();
      } else {
        console.log(`No shared token found with ID: ${tokenId}`);
        return null;
      }
    } catch (error) {
      console.error('Error reading shar!ed token:', error);
    }
  },

  updateSharedToken: async (tokenId, updatedData) => {
    try {
      await sharedTokensCollection.doc(tokenId).update(updatedData);
      console.log(`Shared token ${tokenId} updated successfully.`);
    } catch (error) {
      console.error('Error updating shared token:', error);
    }
  },

  deleteSharedToken: async (tokenId) => {
    try {
      await sharedTokensCollection.doc(tokenId).delete();
      console.log(`Shared token ${tokenId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting shared token:', error);
    }
  },
};

module.exports = sharedTokensFunctions;
