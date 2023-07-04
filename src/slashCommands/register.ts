import { SlashCommandBuilder } from "discord.js"
import { parseOptionsFromInteraction } from "../functions";
import { RegistrationParams, SlashCommand } from "../types";
import { Challonge } from "../middleware/Challonge";

const challonge = Challonge.getInstance();

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("register")
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
        const discord_id = interaction.user.id

        const misc = {
            discord_id: String(discord_id)
        }
        
        const params : RegistrationParams = {
            name: options.tag,
            misc: JSON.stringify(misc),
        }
        const response: {status: number, data: any} = await challonge.register(params);

        if (response.status === 200) {
            const data = response.data
            if (data.errors !== undefined) {
                interaction.editReply({content: `There was an issue: ${String(data.errors)}`})
                return
            } else {
                interaction.editReply({content: "Registration Success!"})
                return
            }
        } else {
            interaction.editReply({content: "Something went wrong. Please content an Organizer."})
            return
        }
    },
    cooldown: 10
}

export default command