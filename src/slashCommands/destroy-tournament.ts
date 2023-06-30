import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor, parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = new Challonge();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("destroy-tournament")
    .setDescription("Destroy a tournament [WARNING] This is irreversible")
    .addStringOption(option => {
        return option
          .setName("id")
          .setDescription("ID number of the tournament")
          .setRequired(true);
      })
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ephemeral: true})
            const options = parseOptionsFromInteraction(interaction);
            if (!interaction.options) return interaction.editReply({content: "Something went wrong..."});
            
            let id = Number(options.id);
    
            console.log(id);
    
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