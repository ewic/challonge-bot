import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("unset")
    .setDescription("Unsets the active tournament")
    ,
    execute: async interaction => {
        challonge.unsetActiveTournamentId();
        interaction.reply({content: "Unset the active tournament."})
    },
    cooldown: 10
}

export default command