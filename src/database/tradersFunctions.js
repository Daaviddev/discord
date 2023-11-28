// Contains functions to add, update, read, and remove traders from the traders subcollection within a server document.

const db = require("../database/firebaseSetup");
const serversCollection = db.collection("servers");

const tradersFunctions = {
  createTrader: async (serverId, discordId, traderData) => {
    try {
      await serversCollection
        .doc(serverId)
        .collection("traders")
        .doc(discordId) // Using Discord ID as the document ID
        .set(traderData);

      console.log(
        `Trader with Discord ID ${discordId} created successfully in server ${serverId}`
      );
    } catch (error) {
      console.error("Error creating trader:", error);
      throw error;
    }
  },

  readTrader: async (serverId, traderId) => {
    try {
      const traderDoc = await serversCollection
        .doc(serverId)
        .collection("traders")
        .doc(traderId)
        .get();

      if (!traderDoc.exists) {
        console.log(
          `No trader found with ID: ${traderId} in server ${serverId}`
        );
        return null;
      }

      return { id: traderDoc.id, ...traderDoc.data() };
    } catch (error) {
      console.error("Error reading trader:", error);
      throw error;
    }
  },

  updateTrader: async (serverId, traderId, updatedData) => {
    try {
      await serversCollection
        .doc(serverId)
        .collection("traders")
        .doc(traderId)
        .update(updatedData);

      console.log(
        `Trader ${traderId} updated successfully in server ${serverId}`
      );
    } catch (error) {
      console.error("Error updating trader:", error);
      throw error;
    }
  },

  deleteTrader: async (serverId, traderId) => {
    try {
      await serversCollection
        .doc(serverId)
        .collection("traders")
        .doc(traderId)
        .delete();

      console.log(
        `Trader ${traderId} deleted successfully from server ${serverId}`
      );
    } catch (error) {
      console.error("Error deleting trader:", error);
      throw error;
    }
  },
};

module.exports = tradersFunctions;
