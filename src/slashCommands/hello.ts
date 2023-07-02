import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies Hello!")
    ,
    execute: interaction => {
        let user = interaction.user.username
        interaction.reply(`Hello, ${user}, ${global.Bot.testVar}`)
    },
    cooldown: 10
}

export default command