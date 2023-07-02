import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Registers yourself for a tournament")
    .addStringOption(option => {
        return option
            .setName("name")
            .setDescription("Gamertag")
            .setRequired(false);
    })
    ,
    execute: interaction => {
        let user = interaction.user.username
        interaction.reply(`Hello, ${user}`)
    },
    cooldown: 10
}

export default command