import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js"
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("reset-tournament")
    .setDescription("Resets the active tournament.")
    .addStringOption(option => {
        return option
            .setName("id")
            .setDescription("Select Tournament")
            .setRequired(false)
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
            const res = await challonge.resetTournament();
            interaction.reply({content: "Reset Tournament"})
        } catch (error) {
            console.log(error);
            interaction.reply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command