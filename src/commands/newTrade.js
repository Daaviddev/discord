const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newtrade")
    .setDescription("Initiates a new trade"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New Trade Setup")
      .setDescription("Click the button below to post your trade.");

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("postTrade")
        .setLabel("Post Trade")
        .setStyle("PRIMARY")
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
