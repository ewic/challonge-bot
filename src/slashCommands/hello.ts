import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies Hello!")
    ,
    execute: interaction => {
        console.log(interaction.user);
        let user = interaction.user.username
        interaction.reply(`Hello, ${user}`)
    },
    cooldown: 10
}

export default command