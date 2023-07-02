import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, Embed } from "discord.js"
import { getThemeColor, parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

let challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List Active Tournaments")
    .addStringOption(option => {
        return option
          .setName("state")
          .setDescription("Tournament State")
          .setRequired(false)
          .setAutocomplete(true);
    })
    ,
    autocomplete: async (interaction) => {
        try {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                { name: "pending", value: "pending" },
                { name: "underway", value: "underway" },
                { name: "awaiting review", value: "awaiting review" },
                { name: "complete", value: "complete" },
            ]
            let filtered: { name: string, value: string }[] = []
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                if (choice.name.includes(focusedValue)) filtered.push(choice);
            }
            await interaction.respond(
                filtered
            );
        } catch (err) {
            console.error(err);
        }
    }
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const options = parseOptionsFromInteraction(interaction);
            const tournaments = await challonge.fetchTournaments(options.state);
            console.log(tournaments);
            if (tournaments.length > 0) {
                const embeds: EmbedBuilder[] = tournaments.map((tournament:any) => {
                    return (
                        new EmbedBuilder()
                        .setColor("#ff7324")
                        .setTitle(tournament['name'])
                        .setDescription(tournament['description'])
                        .setURL(`http://challonge.com/${tournament.url}`)
                        .addFields(
                            { name: "field title", value:"some field here"}
                        )
                        .setTimestamp()
                        .setFooter({ text: `ID: ${tournament['id']}`})
                    )
                })
                interaction.channel?.send({ embeds: embeds });
                interaction.editReply(`Listed Tournaments.`)
            } else {
                interaction.editReply(`No Tournaments matching criteria found`);
            }
        } catch (error) {
            console.log(error);
            interaction.editReply({content: "Something went wrong..."})
        }
    }, 
    cooldown: 10
}

export default command