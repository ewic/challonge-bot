import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor, parseOptionsFromInteraction } from "../functions";
import { SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Registers yourself for the active tournament")
    .addStringOption(option => {
        return option
            .setName("tag")
            .setDescription("Gamertag")
            .setRequired(true);
    })
    .addStringOption(option => {
        return option
            .setName("challonge_username")
            .setDescription("Gamertag")
            .setRequired(false);
    })
    ,
    execute: async interaction => {
        interaction.deferReply({ephemeral: true})
        const options = parseOptionsFromInteraction(interaction);
        let discord_username = interaction.user.username
        let response = await challonge.signup(options.tag, discord_username, options.challonge_username);
        if (response.status === 200) interaction.editReply({content: "Signup Success!"})
        else interaction.editReply({content: "Something went wrong. Please content an Organizer."})
    },
    cooldown: 10
}

export default command