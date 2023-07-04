import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction, tournamentEmbed } from "../functions";
import { SlashCommand, TournamentParams } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

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
        .addStringOption(option => {
            return option
                .setName("game_name")
                .setDescription("Game Name")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .addIntegerOption(option => {
            return option
                .setName("start_time")
                .setDescription("Start Time")
                .setRequired(true)
                .setAutocomplete(true);
        })
        .addIntegerOption(option => {
            return option
                .setName("check_in_duration")
                .setDescription("Check In Duration (in minutes)")
                .setRequired(true)
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
            const focusedOption = interaction.options.getFocused(true);
            let choices: {name: string, value: string}[] = [];
            if (focusedOption.name === `type`) {
                choices = [
                    { name: "Single Elimination", value: "single elimination" },
                    { name: "Double Elimination", value: "double elimination" }
                ];
            } 
            
            if (focusedOption.name === `game_name`) {
                 choices = [
                    { name: "SF6", value: "Street Fighter 6" },
                    { name: "GGST", value: "Guilty Gear Strive" },
                    { name: "T7", value: "Tekken 7" },
                    { name: "T8", value: "Tekken 8" },
                    { name: "SSF2ST", value: "Super Street Fighter 2: Turbo" },
                 ]
            } 

            if (focusedOption.name === 'start_time') {
                choices = [
                    { name: "1400", value: "1400" },
                    { name: "1500", value: "1500" },
                    { name: "1600", value: "1600" },
                    { name: "1700", value: "1700" },
                    { name: "1800", value: "1800" },
                    { name: "1900", value: "1900" },
                    { name: "2000", value: "2000" },
                    { name: "2100", value: "2100" },
                    { name: "2200", value: "2200" },
                    { name: "2300", value: "2300" },
                ]
            }
            
            // Matching algorithm will match focusedOption.value -> choice.name
            const filtered: { name: string, value: string }[] = []
            for (let i = 0; i < choices.length; i++) {
              const choice = choices[i];
              if (choice.name.includes(focusedOption.value)) filtered.push(choice);
            }
            await interaction.respond(
              filtered
            );
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
                game_name: options.game_name,
                start_time: options.start_time,
                check_in_duration: options.check_in_duration,
            }
            const tournament = await challonge.createTournament(tournamentParams);

            if (tournament) {
                // interaction.editReply({embeds: [tournamentEmbed(tournament)]})
                interaction.editReply(`Created Tournament ${options.name.toString()}`)
            } else {
                interaction.editReply({ content: "Something went wrong..." })
            }
        } catch (error) {
            console.log(error);
            interaction.editReply({ content: "Something went wrong..." });
        }
    },
    cooldown: 10
}

export default command