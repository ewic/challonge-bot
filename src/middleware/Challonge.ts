import axios from 'axios';
import { color } from "../functions";

const CHALLONGE_KEY = process.env.CHALLONGE_KEY

export class Challonge {
    url: string;

    constructor() {
        this.url = `https://api.challonge.com/v1/tournaments.json`;
    };

    async fetchTournaments() {
        const res = await axios.get(this.url, { params: { api_key: CHALLONGE_KEY}})
        return res.data;
    }

    async createTournament(name: string, type: 'single elimination' | 'double elimination', description: string, signup_cap?: number) {
        const tournament = {
            api_key: CHALLONGE_KEY,
            name: name,
            tournament_type: type, 
            description: description,
            signup_cap: signup_cap,
        }

        const res = await axios.get(this.url, {params: {api_key: CHALLONGE_KEY, tournament: tournament} });
        return res.data;
    }

    async activeTournamentExists() {

    }
}