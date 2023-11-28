const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const db = require("../database/firebaseSetup"); // Adjust the path as needed

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtoken")
    .setDescription("Adds a token to the server"),

  async execute(interaction) {
    // Fetch tokens from Firestore
    const sharedTokensCollection = db.collection("sharedTokens");
    const tokensSnapshot = await sharedTokensCollection.get();
    const tokens = tokensSnapshot.docs.map((doc) => ({
      label: doc.data().name,
      value: doc.id,
    }));

    // Add 'NEW' option
    tokens.push({ label: "NEW", value: "NEW" });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-token")
        .setPlaceholder("Select a token")
        .addOptions(tokens)
    );

    await interaction.reply({
      content: "Select a token:",
      components: [row],
      ephemeral: true,
    });
  },
};
