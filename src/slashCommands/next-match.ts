import { SlashCommandBuilder } from "discord.js"
import { matchEmbed, parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("next-match")
    .setDescription("Gets your next match")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ephemeral: true})
            const nextMatch = await challonge.findNextMatch(Number(interaction.user.id));

            if (nextMatch === undefined) {
                interaction.editReply({content: `You do not have another match.`})
            } else {
                interaction.editReply({content: `Your Next Match Details`, embeds: [matchEmbed(nextMatch)]})
            }

            return;
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    },
    cooldown: 10
}

export default command