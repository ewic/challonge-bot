import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction, tournamentEmbed } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("activate-tournament")
    .setDescription("Sets a tournament to active.")
    .addNumberOption(option => {
        return option
            .setName("id")
            .setDescription("Select Tournament")
            .setRequired(true)
            .setAutocomplete(true)
    })
    ,
    autocomplete: async interaction => {
        const focusedValue = interaction.options.getFocused();
        const tournaments = await challonge.fetchTournaments(['pending', 'underway'])
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
            await interaction.deferReply({ephemeral: true});
            const options = parseOptionsFromInteraction(interaction);
            const tournamentResponse = await challonge.activateTournament(options.id);
            const { status, message, data } = tournamentResponse
                interaction.editReply({content: `${status} | ${message}`, embeds: [tournamentEmbed(data)]})
        } catch(err) {
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command