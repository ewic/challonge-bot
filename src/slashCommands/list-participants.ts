import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { parseOptionsFromInteraction, participantEmbed, tournamentEmbed } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("list-participants")
    .setDescription("List Participants for the Active Tournament")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const tournamentExists: boolean = await challonge.activeTournamentExists()

            if (!tournamentExists){
                interaction.editReply({content: "No Active Tournament!"})
            } else {
                const participants = await challonge.fetchParticipants();

                let content: string = '📃Participant List \n';
                participants.forEach((participant) => {
                    if (participant['discord_id'] !== undefined) {
                        content += `${participant['discord_id']} | `
                    }
                    content += `${participant['name']}`
                    content += `\n`

                })

                const contentArray = participants.map((participant) => {
                    return `${participant['name']}`
                })

                if (contentArray.length > 0) interaction.channel?.send({ content: content })
                interaction.editReply({content: "Listed participants"})
            }
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command