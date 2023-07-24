import { SlashCommandBuilder } from "discord.js"
import { matchEmbed, parseOptionsFromInteraction, populateParticipantDataForMatch } from "../functions";
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

            const playerId = await challonge.getPlayerIdFromDiscordId(Number(interaction.user.id));
            if (!playerId) {
                interaction.editReply({content: `Error: Player/Match not found. Did you register for this tournament through Discord?`})
            } else {
                const matches = await challonge.findNextMatch(playerId);
                if (matches === undefined) {
                    interaction.editReply({content: `You do not have another match.`})
                } else {
                    const nextMatch = matches[0];
                    await populateParticipantDataForMatch(nextMatch);
                    interaction.editReply({content: `Your Next Match Details`, embeds: [matchEmbed(nextMatch)]})
                }
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