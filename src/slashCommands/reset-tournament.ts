import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("reset-tournament")
    .setDescription("Resets the active tournament.")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const res = await challonge.resetTournament();
            interaction.editReply({content: "Reset Tournament"})
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command