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
        const success = challonge.unsetActiveTournament();
        if (success) interaction.reply({content: "Unset the active tournament."})
        else interaction.reply({content: "Something went wrong..."})
    },
    cooldown: 10
}

export default command