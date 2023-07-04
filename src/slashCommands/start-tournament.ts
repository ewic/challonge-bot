import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";
import { tournamentEmbed } from "../functions";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("start-tournament")
    .setDescription("Starts the active tournament.")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const res = await challonge.startTournament();
            const tournament = res.data.tournament;
            
            interaction.editReply({content: "Started Tournament", embeds: [tournamentEmbed(tournament)]})
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command