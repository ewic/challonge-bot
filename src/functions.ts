import chalk from "chalk"
import { APIEmbed, ColorResolvable, CommandInteraction, EmbedBuilder, Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, PermissionsBitField, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption, MatchData, ParticipantData, TournamentData } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    foundGuild.options[option] = value
    foundGuild.save()
}

export const parseOptionsFromInteraction = (interaction: CommandInteraction) => {
    const options: any = {};
    if (!interaction.options) return false;
    for (let i = 0; i < interaction.options.data.length; i++) {
        const element = interaction.options.data[i];
        if (element.name && element.value) options[element.name] = element.value;
    }
    return options;
}

export const tournamentEmbed = (tournament: TournamentData): EmbedBuilder => {

    const fields = []
    if ( tournament['game_name'] ) fields.push({ name: "Game Name", value: String(tournament['game_name']), inline: false })
    if ( tournament['tournament_type'] ) fields.push({ name: "Type", value: String(tournament['tournament_type']), inline: true })
    if ( tournament['state'] ) fields.push({ name: "Status", value: String(tournament['state']), inline: true })
    if ( tournament['state'] === "underway") fields.push({ name: "Progress", value: String(generateProgressBar(tournament['progress_meter']))})
    
    return (
        new EmbedBuilder()
        .setColor("#ff7324")
        .setTitle(tournament['name'])
        .setDescription(tournament['description'])
        .addFields(fields)
        .setURL(tournament['full_challonge_url'])
        .setTimestamp()
        .setFooter({ text: `ID: ${tournament['id']}` })
    )
}

export const participantEmbed = (participant: ParticipantData): EmbedBuilder => {
    return(
        new EmbedBuilder()
        .setColor("Blue" as ColorResolvable)
        .setTitle(participant.name)
    )
}

export const generateProgressBar = (value: number) => {
    const fullSectionIcon = '🟩'
    const emptySectionIcon = '⬛'

    const progress = Math.round(value / 10);
    const remainder = 10 - progress

    let out = '';
    for (let i = 0; i<progress; i++) {
        out += fullSectionIcon
    }
    for (let i = 0; i < remainder; i++) {
        out += emptySectionIcon
    }

    return out;
}

export const matchEmbed = (match: MatchData): EmbedBuilder => {
    return (
        new EmbedBuilder()
        .setColor("Green" as ColorResolvable)
        .setTitle('Match')
        .setFooter({text: `ID: ${match.id}` })
    )
}