// Contains functions to create, read, update, and delete trades from the trades subcollection within a server document.

const db = require("../database/firebaseSetup");

const serversCollection = db.collection("servers");

const tradesFunctions = {
  createTrade: async (serverId, discordId, tradeData) => {
    try {
      // Check if the trader exists
      const traderDoc = await serversCollection
        .doc(serverId)
        .collection("traders")
        .doc(discordId)
        .get();

      if (!traderDoc.exists) {
        // Create the trader if they don't exist
        await tradersFunctions.createTrader(serverId, discordId, {
          /* additional trader data */
        });
      }

      // Proceed to create the trade
      const tradeRef = await serversCollection
        .doc(serverId)
        .collection("trades")
        .add({
          ...tradeData,
          traderId: discordId, // Associate trade with the trader's Discord ID
        });

      console.log(
        `Trade created successfully in server ${serverId} with ID: ${tradeRef.id}`
      );
      return { id: tradeRef.id, ...tradeData };
    } catch (error) {
      console.error("Error creating trade:", error);
      throw error;
    }
  },

  readTrade: async (serverId, tradeId) => {
    try {
      const tradeDoc = await serversCollection
        .doc(serverId)
        .collection("trades")
        .doc(tradeId)
        .get();

      if (!tradeDoc.exists) {
        console.log(`No trade found with ID: ${tradeId} in server ${serverId}`);
        return null;
      }

      return { id: tradeDoc.id, ...tradeDoc.data() };
    } catch (error) {
      console.error("Error reading trade:", error);
      throw error;
    }
  },

  updateTrade: async (serverId, tradeId, updatedData) => {
    try {
      await serversCollection
        .doc(serverId)
        .collection("trades")
        .doc(tradeId)
        .update(updatedData);
      console.log(`Trade ${tradeId} updated successfully.`);
    } catch (error) {
      console.error("Error updating trade:", error);
      throw error;
    }
  },

  deleteTrade: async (serverId, tradeId) => {
    try {
      await serversCollection
        .doc(serverId)
        .collection("trades")
        .doc(tradeId)
        .delete();
      console.log(`Trade ${tradeId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting trade:", error);
      throw error;
    }
  },

  // New function to create or update trade data
  createOrUpdateTrade: async (serverId, tradeData) => {
    if (tradeData.id) {
      // Update existing trade
      await serversCollection
        .doc(serverId)
        .collection("trades")
        .doc(tradeData.id)
        .update(tradeData);
      console.log(`Trade ${tradeData.id} updated successfully.`);
    } else {
      // Create new trade
      const tradeRef = await serversCollection
        .doc(serverId)
        .collection("trades")
        .add(tradeData);
      console.log(`Trade created successfully with ID: ${tradeRef.id}`);
      return { id: tradeRef.id, ...tradeData };
    }
  },
};

module.exports = tradesFunctions;
