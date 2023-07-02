import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction } from "../functions";
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
        const tournaments = await challonge.fetchTournaments('pending')
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
            challonge.activeTournamentId = options.id;
            interaction.editReply({content: `Activated Tournament ${options.id}`})
        } catch(err) {
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command