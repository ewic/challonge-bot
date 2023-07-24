import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping-opponent")
    .setDescription("Pings your next opponent")
    ,
    execute: interaction => {
        interaction.reply(`ping-opponent command`)
    },
    cooldown: 10
}

export default command