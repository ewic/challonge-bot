import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies Hello!")
    ,
    execute: interaction => {
        const user = interaction.user.username
        interaction.reply(`Hello, ${user}`)
    },
    cooldown: 10
}

export default command