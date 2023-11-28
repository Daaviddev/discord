// Similar to `tradeModal.js`, but with different fields and customId

async function handleOptionalTradeInfoModal(interaction) {
  // Acknowledge the interaction
  await interaction.deferReply({ ephemeral: true });

  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId("optionalTradeInfoModal")
    .setTitle("Optional Trade Information");

  // Create the input fields
  const tpInput = new TextInputBuilder()
    .setCustomId("tpInput")
    .setLabel("Take Profit")
    .setStyle(TextInputStyle.Short);

  // Add the input fields to the modal
  const firstActionRow = new ActionRowBuilder().addComponents(tpInput);
  modal.addComponents(firstActionRow);

  // Show the modal
  await interaction.showModal(modal);
}

module.exports = handleOptionalTradeInfoModal;
