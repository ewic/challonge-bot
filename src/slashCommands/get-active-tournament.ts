import { SlashCommandBuilder } from "discord.js"
import { tournamentEmbed } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("get-active-tournament")
    .setDescription("Gets the active tournament.")
    ,
    execute: async interaction => {
        try {
            if (challonge.activeTournamentId === undefined) {
                interaction.reply({content: `No active tournament`})
            } else {
                const tournament = await challonge.fetchTournament(challonge.activeTournamentId);
                if (tournament) {
                    interaction.reply({content: "The active tournament", embeds: [tournamentEmbed(tournament)]})
                }
            }
        } catch(err) {
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command