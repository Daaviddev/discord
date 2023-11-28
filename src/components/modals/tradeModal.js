const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

async function handleTradeModal(interaction) {
  // Acknowledge the interaction
  await interaction.deferReply({ ephemeral: true });

  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId("tradeModal")
    .setTitle("Trade Information");

  // Create the input fields
  const tokenInput = new TextInputBuilder()
    .setCustomId("tokenInput")
    .setLabel("Token")
    .setStyle(TextInputStyle.Short);

  // Add the input fields to the modal
  const firstActionRow = new ActionRowBuilder().addComponents(tokenInput);
  modal.addComponents(firstActionRow);

  // Show the modal
  await interaction.showModal(modal);
}

module.exports = handleTradeModal;
