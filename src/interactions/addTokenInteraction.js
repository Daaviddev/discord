const db = require("../database/firebaseSetup");
const serversFunctions = require("../database/serversFunctions");
const { ChannelType } = require("discord.js");

module.exports = {
  name: "select-token",
  async execute(interaction) {
    try {
      const {
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        ActionRowBuilder,
      } = require("discord.js");
      const selectedToken = interaction.values[0];

      if (selectedToken === "NEW") {
        const modal = new ModalBuilder()
          .setCustomId("newTokenModal")
          .setTitle("New Token");
        const tokenNameInput = new TextInputBuilder()
          .setCustomId("tokenNameInput")
          .setLabel("Enter the name of the token")
          .setStyle(TextInputStyle.Short);
        const firstActionRow = new ActionRowBuilder().addComponents(
          tokenNameInput
        );
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        // console.log("Modal for new token creation displayed.");
      } else {
        // logic for fetching the selected token from Firestore and adding it to the server
        const sharedTokensCollection = db.collection("sharedTokens");
        const tokenSnapshot = await sharedTokensCollection
          .doc(selectedToken)
          .get();
        const token = tokenSnapshot.data();
        const serverId = interaction.guild.id;
        await serversFunctions.addTokenToServerByName(serverId, token.name);
        await interaction.reply(`Token ${selectedToken} added to the server.`);

        // Create a new channel with the token's name
        try {
          // Check if a channel with the same name already exists
          const existingChannel = interaction.guild.channels.cache.find(
            (channel) => channel.name.toLowerCase() === token.name.toLowerCase()
          );

          console.log("token name:", token.name);
          if (existingChannel) {
            await interaction.editReply({
              content: "A channel with this name already exists!",
            });
          } else {
            await interaction.guild.channels.create({
              name: token.name, // Specify the channel name
              type: ChannelType.GuildText, // Use the ChannelType enum for the channel type
              reason: `Channel for the new token: ${token.name}`,
            });

            // Sending success message
            await interaction.editReply({
              content: "Token and channel created successfully!",
            });
          }
        } catch (error) {
          console.error("Error creating channel:", error);
          await interaction.editReply({
            content:
              "Something went wrong while creating the channel, please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error in select-token interaction:", error);
      await interaction.reply({
        content: "There was an error executing this interaction!",
        ephemeral: true,
      });
    }
  },
};
