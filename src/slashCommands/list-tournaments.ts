import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, Embed } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = new Challonge();
const playerChannel = process.env.CHANNEL_PLAYERS || ''
const organizerChannel = process.env.CHANNEL_ORGANIZER
const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("list-tournaments")
    .setDescription("List Active Tournaments")
    .addChannelOption(option => {
        return option
          .setName("channel")
          .setDescription("Text channel where the active tournaments will be listed.")
          .setRequired(false);
      })
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const tournaments = await challonge.fetchTournaments();
            const embeds: Embed[] = tournaments.map((item:any) => {
                const tournament = item.tournament;
                return (
                    new EmbedBuilder()
                    .setTitle(tournament['name'])
                    .setDescription(tournament['description'])
                    .setTimestamp()
                    .setFooter({ text: `ID: ${tournament['id']}`})
                )
            })
    
            interaction.channel?.send({ embeds: embeds });
            interaction.editReply(`Listed Tournaments.`)
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command