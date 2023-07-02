import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies Hello!")
    ,
    execute: interaction => {
        let user = interaction.user.username
        interaction.reply(`Hello, ${user}`)
    },
    cooldown: 10
}

export default command