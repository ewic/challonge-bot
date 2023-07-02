import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("destroy-tournament")
    .setDescription("Destroy a tournament [WARNING] This is irreversible")
    .addStringOption(option => {
        return option
          .setName("id")
          .setDescription("ID number of the tournament")
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
            await interaction.deferReply({ephemeral: true})
            const options = parseOptionsFromInteraction(interaction);
            if (!interaction.options) return interaction.editReply({content: "Something went wrong..."});
            const id = Number(options.id);
            const response = await challonge.destroyTournament(id);
            console.log(response);
            interaction.editReply({content: "Success!"})
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command