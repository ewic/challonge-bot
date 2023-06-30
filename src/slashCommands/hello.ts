import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = new Challonge();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Replies Hello!")
    ,
    execute: interaction => {
        challonge.fetchTournaments();
        let user = interaction.user.username
        interaction.reply(`Hello, ${user}`)
    },
    cooldown: 10
}

export default command