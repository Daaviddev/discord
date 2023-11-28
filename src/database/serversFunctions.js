const db = require("../database/firebaseSetup");
const admin = require("firebase-admin");

const serversCollection = db.collection("servers");
const sharedTokensCollection = db.collection("sharedTokens");

const serversFunctions = {
  createServer: async (serverId, serverData) => {
    try {
      await serversCollection.doc(serverId).set(serverData);
      console.log(`Server ${serverId} created successfully.`);
    } catch (error) {
      console.error("Error creating server:", error);
    }
  },

  readServer: async (serverId) => {
    try {
      const doc = await serversCollection.doc(serverId).get();
      if (doc.exists) {
        return doc.data();
      } else {
        console.log(`No server found with ID: ${serverId}`);
        return null;
      }
    } catch (error) {
      console.error("Error reading server:", error);
    }
  },

  updateServer: async (serverId, updatedData) => {
    try {
      await serversCollection.doc(serverId).update(updatedData);
      console.log(`Server ${serverId} updated successfully.`);
    } catch (error) {
      console.error("Error updating server:", error);
    }
  },

  deleteServer: async (serverId) => {
    try {
      await serversCollection.doc(serverId).delete();
      console.log(`Server ${serverId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  },

  async addTokenToServerByName(serverId, tokenName) {
    try {
      // Check if the token exists in sharedTokens
      const tokenQuerySnapshot = await sharedTokensCollection
        .where("name", "==", tokenName)
        .get();

      let tokenId;
      if (!tokenQuerySnapshot.empty) {
        // Token exists, use its ID
        const tokenDoc = tokenQuerySnapshot.docs[0];
        tokenId = tokenDoc.id;
      } else {
        // Token does not exist, create a new token
        const newTokenRef = await sharedTokensCollection.add({
          name: tokenName,
        });
        tokenId = newTokenRef.id;
        console.log(`New shared token created with ID: ${tokenId}`);
      }

      // Add the token ID to the server's token list
      const serverRef = serversCollection.doc(serverId);
      await serverRef.update({
        tokens: admin.firestore.FieldValue.arrayUnion(tokenId),
      });
      console.log(`Token ${tokenId} added to server ${serverId}`);
    } catch (error) {
      console.error("Error adding token to server:", error);
    }
  },

  async addTokenToServerById(serverId, tokenId) {
    try {
      // Add the token ID to the server's token list
      const serverRef = serversCollection.doc(serverId);
      await serverRef.update({
        tokens: admin.firestore.FieldValue.arrayUnion(tokenId),
      });
      console.log(`Token ${tokenId} added to server ${serverId}`);
    } catch (error) {
      console.error("Error adding token to server:", error);
    }
  },

  removeTokenFromServer: async (serverId, tokenId) => {
    try {
      const serverRef = serversCollection.doc(serverId);
      await serverRef.update({
        tokens: admin.firestore.FieldValue.arrayRemove(tokenId),
      });
      console.log(`Token ${tokenId} removed from server ${serverId}`);
    } catch (error) {
      console.error("Error removing token from server:", error);
    }
  },
};

module.exports = serversFunctions;
