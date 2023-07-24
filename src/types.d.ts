import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

interface GuildOptions {
    prefix: string,
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

export interface TournamentParams {
    name: string,
    tournament_type: string,
    description: string,
    signup_cap?: number,
    open_signup?: boolean,
    game_name: string,
    start_time: Date,
    check_in_duration: number,
}

export interface TournamentData {
    id: number,
    name: string,
    tournament_type: string,
    description: string,
    signup_cap?: number,
    open_signup?: boolean,
    state: `pending` | `underway` | `awaiting review` | `complete`,
    url: string,
    progress_meter: number,
    full_challonge_url: string,
    live_image_url: string,
    game_name: string,
}

export interface RegistrationParams {
    name: string,
    misc: string,
    challonge_username?: string,
}

export interface ParticipantData {
    id: number,
    tournament_id: number,
    name: string,
    seed: number,
    discord_id?: number,
    challonge_username?: string,
}

export interface MatchData {
    id: number,
    player1_id: number,
    player1_discord_id?: number,
    player1?: ParticipantData,
    player2_id: number,
    player2_discord_id?: number,
    player2?: ParticipantData,
    started_at: string,
    state: string,
    tournament_id: number,
    underway_at: string,
    updated_at: string,
    winner_id?: number,
    scores_csv: string,
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}
