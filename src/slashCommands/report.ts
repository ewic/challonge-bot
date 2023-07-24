import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reports the outcome of a match")
    ,
    execute: interaction => {
        interaction.reply(`report command`)
    },
    cooldown: 10
}

export default command