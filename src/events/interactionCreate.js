const generateId = require("../utils/generateId");
const { ChannelType } = require("discord.js");
const serversFunctions = require("../database/serversFunctions");
const db = require("../database/firebaseSetup");

// Importing the handleNewTokenModal function
const handleNewTokenModal = require("../interactions/modals/handleNewTokenModal");

// Import new trade modal handlers
const handleTradeModal = require("../interactions/modals/handleTradeModal");
const handleOptionalTradeInfoModal = require("../interactions/modals/handleOptionalTradeInfoModal");
const handleFinalizeTrade = require("../interactions/handleFinalizeTrade");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { client } = interaction;

    if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case "newTokenModal":
          await handleNewTokenModal(interaction);
          break;
        case "tradeModal":
          // Handling mandatory trade modal submission
          await handleOptionalTradeInfoModal(interaction);
          break;
        case "optionalTradeInfoModal":
          // Handling optional trade info modal submission
          await handleFinalizeTrade(interaction);
          break;
        default:
          console.log(`Unhandled modal ID: ${interaction.customId}`);
      }
    } else if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) {
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error("Error executing command:", error);
          await interaction.reply({
            content: "There was an error executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isMessageComponent()) {
      if (interaction.customId === "select-token") {
        const addTokenInteractionHandler = require("../interactions/addTokenInteraction");
        await addTokenInteractionHandler.execute(interaction);
      } else if (interaction.customId === "postTrade") {
        // Handling "Post Trade" button interaction
        await handleTradeModal(interaction);
      }
    }
  },
};
