import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction, tournamentEmbed } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("get-tournament")
    .setDescription("Gets the active tournament.")
    .addIntegerOption(option => {
        return option
        .setName("id")
        .setDescription("ID Number of the tournament")
        .setRequired(true)
        .setAutocomplete(true)
    })
    ,
    autocomplete: async interaction => {
        const focusedValue = interaction.options.getFocused();
        const tournaments = await challonge.fetchTournaments()
        const choices = tournaments.map(tournament => {
            return {name: tournament.name, value: String(tournament.id)}
        })
        const filtered: { name: string, value: string }[] = []
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                if (choice.name.includes(focusedValue)) filtered.push(choice);
            }
            await interaction.respond(
                filtered
            );
    }
    ,
    execute: async interaction => {
        try {
            if (!interaction.options) return interaction.reply({content: "Something went wrong..."})
            else {
                const options = parseOptionsFromInteraction(interaction);
                const id = Number(options.id);
                const tournament = await challonge.fetchTournament(id);
                if (tournament) interaction.reply({embeds: [tournamentEmbed(tournament)]})
                else interaction.reply({content: "Something went wrong..."})
            }
        } catch(err) {
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command