import { Client, GatewayIntentBits, Collection, PermissionFlagsBits,} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import axios from "axios";
config()

client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.TOKEN)

// Handles auto-stop on process exit.
function stopEvent(code: any) {
    console.log("Stopping. Code "+code+".");
    client.destroy();
}
process.addListener("SIGINT", stopEvent);
process.addListener("SIGTERM", stopEvent);

axios.defaults.baseURL = `https://api.challonge.com/v1/`;
axios.defaults.params = {};
axios.defaults.params['api_key'] = process.env.CHALLONGE_TOKEN;