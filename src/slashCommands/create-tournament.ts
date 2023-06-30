import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor, parseOptionsFromInteraction } from "../functions";
import { SlashCommand, TournamentParams } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = new Challonge();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("create-tournament")
        .setDescription("Create a new tournament!")
        .addStringOption(option => {
            return option
                .setName("name")
                .setDescription("Name of the tournament")
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName("description")
                .setDescription("Description")
                .setRequired(true);
        })
        .addStringOption(option => {
            return option
                .setName("type")
                .setDescription("Type of Tournament")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .addIntegerOption(option => {
            return option
                .setName("signup_cap")
                .setDescription("Signup Cap")
                .setRequired(false)
        })
    ,
    autocomplete: async (interaction) => {
        try {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                { name: "Single Elimination", value: "single elimination" },
                { name: "Double Elimination", value: "Double elimination" }
            ];
            let filtered: { name: string, value: string }[] = []
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                if (choice.name.includes(focusedValue)) filtered.push(choice);
            } 
            await interaction.respond(filtered);
        } catch (error) {
            console.log( `Error: ${error.message}` );
        } 
    }
    ,
    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true});
            const options = parseOptionsFromInteraction(interaction);
            if (!options) return interaction.editReply("Something went wrong...");
            const tournamentParams: TournamentParams = {
                name: options.name,
                description: options.description,
                tournament_type: options.tournament_type,
            }
            const response = await challonge.createTournament(tournamentParams);
            console.log(response);
            interaction.editReply(`Created Tournament ${options.name.toString()}`)
        } catch (error) {
            console.log(error);
            interaction.editReply({ content: "Something went wrong..." });
        }
    },
    cooldown: 10
}

export default command