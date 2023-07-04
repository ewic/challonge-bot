import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("get-match")
    .setDescription("Gets your next match")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ephemeral: true})
            interaction.editReply({content: "Success!"})
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command