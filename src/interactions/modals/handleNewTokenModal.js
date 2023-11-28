const generateId = require("../../utils/generateId");
const { ChannelType } = require("discord.js");
const serversFunctions = require("../../database/serversFunctions");
const db = require("../../database/firebaseSetup");

async function handleNewTokenModal(interaction) {
  // Acknowledge the interaction
  await interaction.deferReply({ ephemeral: true });

  try {
    const tokenName = interaction.fields.getTextInputValue("tokenNameInput");

    // Check if the token name already exists in the database
    const sharedTokensCollection = db.collection("sharedTokens");
    const tokenQuerySnapshot = await sharedTokensCollection
      .where("name", "==", tokenName)
      .get();

    if (!tokenQuerySnapshot.empty) {
      // Token name already exists, inform the user and do not create a new token
      await interaction.editReply({
        content: `A token with the name '${tokenName}' already exists. Please use a different name.`,
      });
      return; // Exit the function early
    }

    // Token name does not exist, proceed with creation
    const newTokenId = generateId();
    await sharedTokensCollection.doc(newTokenId).set({ name: tokenName });

    // Add the new token's ID to the server's tokenList
    const serverId = interaction.guild.id;
    await serversFunctions.addTokenToServerById(serverId, newTokenId);

    // Create a new channel with the token's name
    try {
      await interaction.guild.channels.create({
        name: tokenName, // Specify the channel name
        type: ChannelType.GuildText, // Use the ChannelType enum for the channel type
        reason: `Channel for the new token: ${tokenName}`,
      });

      // Sending success message
      await interaction.editReply({
        content: "Token and channel created successfully!",
      });
    } catch (error) {
      console.error("Error creating channel:", error);
      await interaction.editReply({
        content:
          "Something went wrong while creating the channel, please try again.",
      });
    }
  } catch (error) {
    console.error("Error in token creation:", error);
    await interaction.editReply({
      content: "Something went wrong in token creation, please try again.",
    });
  }
}

module.exports = handleNewTokenModal;
