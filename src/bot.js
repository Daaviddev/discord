const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const serversFunctions = require("./database/serversFunctions");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

client.commands = new Collection();
client.interactions = new Collection();

// Initialize global.chartUrls map
global.chartUrls = new Map();

// Loading commands
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Loading interactions
const interactionFiles = fs
  .readdirSync(path.join(__dirname, "interactions"))
  .filter((file) => file.endsWith(".js"));
for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);
  client.interactions.set(interaction.name, interaction);
  console.log(`Registered interaction: ${interaction.name}`);
}

// Loading events
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) return console.error("Guild not found");

  // rest of your on ready function...
});

client.on("guildCreate", async (guild) => {
  try {
    // Check if the server is already in the database
    const existingServer = await serversFunctions.readServer(guild.id);

    if (!existingServer) {
      // Server not in database, create a new entry
      const serverData = {
        id: guild.id,
        name: guild.name,
        joinedAt: new Date(),
      };

      await serversFunctions.createServer(guild.id, serverData);
      console.log(`New server added to database: ${guild.name}`);
    }
  } catch (error) {
    console.error("Error handling new server: ", error);
  }
});

// Login to Discord with your client's token
client.login(config.token);
