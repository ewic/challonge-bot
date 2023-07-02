import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("set-active-tournament")
    .setDescription("Sets a tournament to active.")
    .addNumberOption(option => {
        return option
            .setName("id")
            .setDescription("ID Number of the tournament")
            .setRequired(true)
            // .setAutocomplete(true)
    })
    ,
    // autocomplete: async interaction => {
    //     challonge.fetchTournaments()
    // }
    // ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ephemeral: true});
            interaction.reply(`set-active-tournament`)
        } catch(err) {
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command