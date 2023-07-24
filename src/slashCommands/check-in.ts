import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Check in to the active tournament")
    ,
    execute: interaction => {
        interaction.reply({content: "Test response"})
    },
    cooldown: 10
}

export default command