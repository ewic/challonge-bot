import chalk from "chalk"
import { ColorResolvable, CommandInteraction, EmbedBuilder, Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js"
import GuildDB from "./schemas/Guild"
import { GuildOption, MatchData, ParticipantData, TournamentData } from "./types"
import mongoose from "mongoose";
import { Challonge } from "./middleware/Challonge";

const challonge = Challonge.getInstance();

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: string) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    const neededPermissions: PermissionResolvable[] = []
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
    const foundGuild = await GuildDB.findOne({ guildID: guild.id })
    if (!foundGuild) return null;
    return foundGuild.options[option]
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    const foundGuild = await GuildDB.findOne({ guildID: guild.id })
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
        .setFooter({ text: `Tournament ID: ${tournament['id']}` })
    )
}

export const participantEmbed = (participant: ParticipantData): EmbedBuilder => {
    return(
        new EmbedBuilder()
        .setColor("Blue" as ColorResolvable)
        .setTitle(participant.name)
        .setFooter({text: `Participant ID: ${participant['id']}`})
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
    const player1 = match['player1']
    const player2 = match['player2']
    let title = ``

    if (player1 !== undefined && player2 !== undefined) {
        title = `${player1['name']} 🥊 🆚 🥊 ${player2['name']}`
    }

    return (
        new EmbedBuilder()
        .setColor("Green" as ColorResolvable)
        .setTitle(`${title}`)
        .addFields(
            { name: 'Game Name', value: `${challonge.activeTournament ? challonge.activeTournament['game_name'] : null}`}
        )
        .setFooter({text: `Match ID: ${match.id}` })
    )
}

export const populateParticipantDataForMatch = async (match: MatchData): Promise<MatchData> => {
    const player1_id = match['player1_id'];
    const player2_id = match['player2_id'];
    
    const player1 = await challonge.fetchParticipantData(Number(player1_id))
    const player2 = await challonge.fetchParticipantData(Number(player2_id))

    match['player1'] = player1;
    match['player2'] = player2;

    return match;
}